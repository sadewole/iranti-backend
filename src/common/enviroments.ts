export default () => ({
  database: {
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt_secret: process.env.JWT_SECRET,
  redis: {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  mailtrap: {
    sender_email: process.env.MAIL_SENDER_EMAIL,
    hostname: process.env.MAIL_HOSTNAME,
    port: process.env.MAIL_PORT,
    auth_user: process.env.MAIL_AUTH_USER,
    auth_pass: process.env.MAIL_AUTH_PASS,
  },
});
