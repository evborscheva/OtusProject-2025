import { Pool } from 'pg';
import config from '../config/dbConfig';

class DatabaseService {
  pool: Pool | null;

  constructor() {
    this.pool = null;
  }

  async connect() {
    if (this.pool) {
      return this.pool;
    }

    const dbConfig: any = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 30000,
      max: 5
    };
    this.pool = new Pool(dbConfig);

    try {
      const client = await this.pool.connect();
      try {
        await client.query('SELECT NOW()');
      } finally {
        client.release();
      }
      console.log('Database connected successfully');
      return this.pool;
    } catch (error) {
      this.pool = null;
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]) {
    if (!this.pool) {
      await this.connect();
    }
    return this.pool?.query(text, params);
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database disconnected');
    }
  }

  async findUser(username: string) {
    const result = await this.query('SELECT * FROM users WHERE username = $1', [username]);
    return result?.rows[0];
  }

  async findArticle(slug: string) {
    const result = await this.query('SELECT * FROM articles WHERE slug = $1', [slug]);
    return result?.rows[0];
  }

  async findTag(name: string) {
    const result = await this.query('SELECT * FROM tags WHERE name = $1', [name]);
    return result?.rows[0];
  }
}

export default new DatabaseService();
