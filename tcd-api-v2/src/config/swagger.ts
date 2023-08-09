import { DocumentBuilder } from '@nestjs/swagger';

const swaggerTags = {
  auth: 'auth',
  partner: "Partner's",
  user: 'User',
  page: 'Pages',
  public_entries: 'Public Entries',
  admin: 'Admin',
  tcd_update: 'TCD-Update',
};

const swaggerConfig = new DocumentBuilder()
  .setTitle('TCD API')
  .setDescription('The TCD API Document')
  .setVersion('1.0')
  .addBearerAuth(
    {
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: `[just text field] Please enter token in following`,
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header',
    },
    'authorization',
  )
  .build();

export { swaggerConfig, swaggerTags };
