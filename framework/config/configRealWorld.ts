import 'dotenv/config';

const config = {
  baseURL: process.env.REALWORLD_API_URL ?? 'https://conduit-194.113.34.183.sslip.io',
  email: process.env.REALWORLD_EMAIL,
  password: process.env.REALWORLD_PASSWORD,
  username: process.env.REALWORLD_API_USERNAME
};

export default Object.freeze(config);
