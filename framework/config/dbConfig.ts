import 'dotenv/config';

const config = {
  host: '194.113.34.183',
  port: '5432',
  database: 'conduit',
  user: process.env.REALWORLD_PG_USER,
  password: process.env.REALWORLD_PG_PASSWORD
};

export default Object.freeze(config);
