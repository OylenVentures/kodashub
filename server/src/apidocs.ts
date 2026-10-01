import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';

const config = new DocumentBuilder()
  .setTitle(process.env.APP_NAME || 'NestJs API')
  .setDescription(
    `This api provides an interface for Kodashub to manage its resources.`,
  )
  .setVersion('1.0')
  .addBearerAuth()
  .setContact(
    'Oylen Group',
    'https://oylengroup.com.ng',
    'info@oylengroup.com.ng',
  )
  .addServer(`${process.env.APP_URL}`, 'Local')
  .addServer('https://api.kh.oylengroup.com.ng', 'Production')
  .build();

function setupApiDocs(app: INestApplication<any>) {
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  app.use(
    '/docs/api',
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          scriptSrcElem: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          fontSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );

  app.use(
    '/docs/api',
    apiReference({
      theme: 'purple',
      content: document,
      pageTitle: `${process.env.APP_NAME || 'NestJs API'} Documentation`,
      defaultOpenFirstTag: false,
      orderRequiredPropertiesFirst: false,
      // orderSchemaPropertiesBy: 'preserve',
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      favicon: '/favicon.ico',
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'fetch',
      },
    }),
  );
}

export default setupApiDocs;
