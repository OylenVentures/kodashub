/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { StorageSyncDto, VoltCalcToolDto } from './dto/tool.dto';
import { v2 as cloudinary } from 'cloudinary';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const FETCH_TIMEOUT_MS = 30_000; // 30 seconds per file fetch
const UPLOAD_BATCH_SIZE = 10; // concurrent uploads per page

@Injectable()
export class ToolService {
  private readonly logger = new Logger(ToolService.name);

  calculateVoltUsage(dto: VoltCalcToolDto) {
    if (dto.currentReading < dto.previousReading) {
      throw new BadRequestException(
        'Current reading cannot be less than previous reading.',
      );
    }

    const consumption = dto.currentReading - dto.previousReading;
    const selectedBand = this.TARIFF_BANDS.find(
      (band) => band.name === dto.tariffBand,
    );
    if (!selectedBand) {
      throw new BadRequestException('Invalid tariff band.');
    }
    const cost = Math.round(
      consumption * selectedBand.rate +
        consumption * selectedBand.rate * (7.5 / 100),
    );
    return {
      message: 'Electricity usage calculated successfully',
      result: { consumption, cost, band: selectedBand },
    };
  }

  async cloudinaryS3Sync(dto: StorageSyncDto) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: dto.prevStorageName,
      api_key: dto.prevApiKey,
      api_secret: dto.prevSecretKey,
    });

    // Configure AWS S3 (fallback to us-east-1 if region not provided)
    const s3Client = new S3Client({
      region: dto.newRegion ?? 'us-east-1',
      credentials: {
        accessKeyId: dto.newApiKey,
        secretAccessKey: dto.newSecretKey,
      },
    });

    let nextCursor: string | null = null;
    let totalMigrated = 0;
    let totalFailed = 0;

    try {
      // ── Migration Phase ──────────────────────────────────────────────────────
      do {
        // Fetch up to 500 resources per page from Cloudinary
        const result = await cloudinary.api.resources({
          max_results: 500,
          next_cursor: nextCursor,
          type: 'upload',
          resource_type: dto.fileType,
        });

        // Upload resources in concurrent batches to avoid sequential bottleneck
        for (let i = 0; i < result.resources.length; i += UPLOAD_BATCH_SIZE) {
          const batch = result.resources.slice(i, i + UPLOAD_BATCH_SIZE);
          const batchResults = await Promise.allSettled(
            batch.map((resource) =>
              this.uploadResourceToS3(resource, s3Client, dto.newStorageName),
            ),
          );

          for (const outcome of batchResults) {
            if (outcome.status === 'fulfilled') {
              totalMigrated++;
            } else {
              totalFailed++;
              this.logger.error(`Upload failed: ${outcome.reason}`);
            }
          }
        }
        nextCursor = result.next_cursor ?? null;
      } while (nextCursor);

      this.logger.log(
        `Migration completed. ✅ ${totalMigrated} succeeded, ❌ ${totalFailed} failed.`,
      );
      // ── Verification Phase ───────────────────────────────────────────────────
      return await this.verifyCloudinaryMigration(
        dto,
        s3Client,
        dto.newStorageName,
      );
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  async cloudflareS3Sync(dto: StorageSyncDto) {
    // 1. Configure Cloudflare (Requires endpoint for R2)
    const cloudflare = new S3Client({
      region: dto.prevRegion ?? 'auto',
      endpoint: `https://${dto.prevAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: dto.prevApiKey,
        secretAccessKey: dto.prevSecretKey,
      },
      forcePathStyle: true,
    });

    // 2. Configure AWS S3
    const s3Client = new S3Client({
      region: dto.newRegion ?? 'us-east-1',
      credentials: {
        accessKeyId: dto.newApiKey,
        secretAccessKey: dto.newSecretKey,
      },
    });

    let nextCursor: string | undefined = undefined;
    let totalMigrated = 0;
    let totalFailed = 0;
    const UPLOAD_BATCH_SIZE = 10; // Define your batch size

    try {
      do {
        // Fetch objects from Cloudflare
        const command = new ListObjectsV2Command({
          Bucket: dto.prevStorageName,
          ContinuationToken: nextCursor,
        });

        const resp = (await cloudflare.send(command)) as any;
        const objects = resp.Contents ?? [];

        // Process in batches
        for (let i = 0; i < objects.length; i += UPLOAD_BATCH_SIZE) {
          const batch = objects.slice(i, i + UPLOAD_BATCH_SIZE);

          const batchResults = await Promise.allSettled(
            batch.map((obj) =>
              this.migrateSingleObject(obj, cloudflare, s3Client, dto),
            ),
          );

          for (const outcome of batchResults) {
            if (outcome.status === 'fulfilled') {
              totalMigrated++;
            } else {
              totalFailed++;
              this.logger.error(
                `Migration failed for an item: ${outcome.reason}`,
              );
            }
          }
        }

        nextCursor = resp.NextContinuationToken;
      } while (nextCursor);

      this.logger.log(
        `Migration completed. ✅ ${totalMigrated} succeeded, ❌ ${totalFailed} failed.`,
      );
      return await this.verifyCloudflareMigration(
        dto,
        s3Client,
        dto.newStorageName,
      );
    } catch (error) {
      this.logger.error(`Migration Process Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Downloads a single Cloudinary resource and uploads it to S3.
   * Uses AbortController to enforce a per-file fetch timeout.
   * Streams the response body directly into the S3 Upload to avoid
   * loading the entire file into memory as an ArrayBuffer.
   */
  private async uploadResourceToS3(
    resource: any,
    s3Client: S3Client,
    bucketName: string,
  ): Promise<void> {
    this.logger.log(`Migrating: ${resource.public_id}...`);

    // Abort the fetch if it takes longer than FETCH_TIMEOUT_MS
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(resource.secure_url, {
        method: 'GET',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${resource.public_id}: HTTP ${response.status}`,
      );
    }

    // Stream the response body directly — avoids loading the whole file into memory
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: `${resource.public_id}.${resource.format}`,
        Body: response.body as any, // ReadableStream → passed directly to AWS SDK
        ContentType: `${resource.resource_type}/${resource.format}`,
      },
      queueSize: 4, // concurrent multipart parts
      partSize: 1024 * 1024 * 5, // 5 MB per part
      leavePartsOnError: false, // auto-clean failed multipart uploads
    });

    upload.on('httpUploadProgress', (progress) => {
      this.logger.debug(
        `${resource.public_id}: ${progress.loaded} bytes uploaded`,
      );
    });

    await upload.done();
    this.logger.log(`✅ Uploaded ${resource.public_id} to S3.`);
  }

  /**
   * Verifies the migration by comparing asset counts between
   * Cloudinary and the target S3 bucket (scoped to the migrated prefix).
   */
  private async verifyCloudinaryMigration(
    dto: StorageSyncDto,
    s3Client: S3Client,
    bucketName: string,
  ): Promise<{
    message: string;
    cloudinaryCount: number;
    s3Count: number;
    success: boolean;
  }> {
    this.logger.log('--- Starting Verification ---');

    // 1. Count Cloudinary assets
    let cloudinaryCount = 0;
    let cursor: string | null = null;
    try {
      do {
        const result = await cloudinary.api.resources({
          max_results: 500,
          next_cursor: cursor,
          type: 'upload',
          resource_type: dto.fileType,
        });
        cloudinaryCount += result.resources.length;
        cursor = result.next_cursor ?? null;
      } while (cursor);
    } catch (err) {
      this.logger.error('Error counting Cloudinary assets:', err.message);
    }

    // 2. Count S3 objects (scoped to migrated prefix to avoid false mismatches)
    let s3Count = 0;
    let continuationToken: string | undefined;
    try {
      do {
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: dto.newStorageName ? `${dto.newStorageName}/` : undefined,
          ContinuationToken: continuationToken,
        });
        const response = (await s3Client.send(command)) as any;
        s3Count += response.KeyCount || 0;
        continuationToken = response.NextContinuationToken;
      } while (continuationToken);
    } catch (err) {
      this.logger.error('Error counting S3 objects:', err.message);
    }

    // 3. Compare
    this.logger.log(`Cloudinary Assets: ${cloudinaryCount}`);
    this.logger.log(`S3 Objects:        ${s3Count}`);
    const success = cloudinaryCount === s3Count;
    if (success) {
      this.logger.log('✅ SUCCESS: File counts match perfectly.');
    } else {
      this.logger.warn(
        '⚠️ WARNING: File counts do not match. Some files may have failed.',
      );
    }

    return {
      success,
      cloudinaryCount,
      s3Count,
      message: success
        ? `Migration verified. ${cloudinaryCount} assets matched between Cloudinary and S3.`
        : `Count mismatch. Cloudinary: ${cloudinaryCount}, S3: ${s3Count}. Check logs for failed uploads.`,
    };
  }

  /**
   * Verifies the migration by comparing asset counts between
   * Cloudflare and the target S3 bucket (scoped to the migrated prefix).
   */
  private async verifyCloudflareMigration(
    dto: StorageSyncDto,
    s3Client: S3Client,
    bucketName: string,
  ): Promise<{
    message: string;
    cloudflareCount: number;
    s3Count: number;
    success: boolean;
  }> {
    this.logger.log('--- Starting Cloudflare to S3 Verification ---');

    // 1. Initialize Cloudflare Source Client
    const cloudflareClient = new S3Client({
      region: 'auto',
      endpoint: `https://${dto.prevAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: dto.prevApiKey,
        secretAccessKey: dto.prevSecretKey,
      },
    });

    // 2. Count Cloudflare (Source) Objects
    let cloudflareCount = 0;
    let cfContinuationToken: string | undefined;
    try {
      do {
        const command = new ListObjectsV2Command({
          Bucket: dto.prevStorageName,
          ContinuationToken: cfContinuationToken,
        });
        const resp = (await cloudflareClient.send(command)) as any;
        // Use KeyCount or length of Contents array
        cloudflareCount += resp.Contents?.length || 0;
        cfContinuationToken = resp.NextContinuationToken;
      } while (cfContinuationToken);
    } catch (err) {
      this.logger.error(`Error counting Cloudflare assets: ${err.message}`);
      throw err;
    }

    // 3. Count AWS S3 (Destination) Objects
    let s3Count = 0;
    let s3ContinuationToken: string | undefined;
    try {
      do {
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          ContinuationToken: s3ContinuationToken,
        });
        const response = (await s3Client.send(command)) as any;
        s3Count += response.Contents?.length || 0;
        s3ContinuationToken = response.NextContinuationToken;
      } while (s3ContinuationToken);
    } catch (err) {
      this.logger.error(`Error counting S3 objects: ${err.message}`);
      throw err;
    }

    // 4. Comparison Logic
    this.logger.log(`Cloudflare (R2) Objects: ${cloudflareCount}`);
    this.logger.log(`AWS S3 Objects:          ${s3Count}`);

    const success = cloudflareCount === s3Count;
    if (success) {
      this.logger.log('✅ SUCCESS: Cloudflare and S3 object counts match.');
    } else {
      this.logger.warn(
        `⚠️ WARNING: Mismatch detected! Difference: ${Math.abs(cloudflareCount - s3Count)} files.`,
      );
    }

    return {
      success,
      cloudflareCount,
      s3Count,
      message: success
        ? `Migration verified. ${cloudflareCount} objects matched.`
        : `Count mismatch. Cloudflare: ${cloudflareCount}, S3: ${s3Count}.`,
    };
  }

  // Helper method to handle the actual Stream/Buffer transfer
  private async migrateSingleObject(
    obj: any,
    source: S3Client,
    dest: S3Client,
    dto: StorageSyncDto,
  ) {
    if (!obj.Key) return;

    // 1. Get from Source
    const getCommand = new GetObjectCommand({
      Bucket: dto.prevStorageName,
      Key: obj.Key,
    });
    const { Body, ContentType } = await source.send(getCommand);

    // 2. Upload to Destination
    const upload = new Upload({
      client: dest,
      params: {
        Bucket: dto.newStorageName,
        Key: obj.Key,
        Body: Body as any, // The SDK handles streams automatically
        ContentType,
      },
    });

    return await upload.done();
  }

  // Tariff plans based on typical Nigerian electricity distribution company offerings
  private readonly TARIFF_BANDS = [
    {
      id: 'A',
      name: 'Band A',
      rate: 209.5,
      description: 'Premium Service',
      hours: '20+ hours/day',
    },
    {
      id: 'B',
      name: 'Band B',
      rate: 69.75,
      description: 'Standard Plus',
      hours: '16-20 hours/day',
    },
    {
      id: 'C',
      name: 'Band C',
      rate: 53.41,
      description: 'Standard',
      hours: '12-16 hours/day',
    },
    {
      id: 'D',
      name: 'Band D',
      rate: 45.29,
      description: 'Basic Plus',
      hours: '8-12 hours/day',
    },
    {
      id: 'E',
      name: 'Band E',
      rate: 45.29,
      description: 'Basic',
      hours: '4-8 hours/day',
    },
  ];
}
