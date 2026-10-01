import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';

// Set up API documentation
const config = new DocumentBuilder()
  .setTitle(process.env.APP_NAME || 'NestJS API')
  .setDescription(
    `${process.env.APP_DESCRIPTION || 'This is a NestJS API template for building RESTful APIs with NestJS framework.'}`,
  )
  .setVersion('1.0')
  .addBearerAuth()
  .setContact(
    'Philip Oyelegbin',
    'https://philip.oyelegbin.name.ng',
    'philip@oyelegbin.name.ng',
  )
  .addServer(`${process.env.APP_URL}`, 'Local')
  .addServer('https://staging-api.nestjs.com', 'Staging')
  .addServer('https://api.nestjs.com', 'Production')
  .build();

function buildSwaggerConfig(app: INestApplication<any>) {
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('/docs/swagger', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      //   defaultModelsExpandDepth: -1,
      persistAuthorization: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  app.use(
    '/docs/scalar',
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
    '/docs/scalar',
    apiReference({
      theme: 'purple',
      content: document,
      pageTitle: `${process.env.APP_NAME || 'NestJs API'} Documentation`,
      defaultOpenFirstTag: false,
      orderRequiredPropertiesFirst: false,
      // orderSchemaPropertiesBy: 'preserve',
      // favicon: '/favicon.ico',
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'fetch',
      },
    }),
  );
}

export default buildSwaggerConfig;
