export const config = () => ({
  port: process.env.PORT,
  db: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    entities: ['*/*.entity{.ts,.js}'],
    synchronize: true,
    autoLoadEntities: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiry: process.env.JWT_EXPIRATION_TIME,
  },
});
