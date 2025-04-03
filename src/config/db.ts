import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'node_training',
  process.env.MYSQL_USER || 'user',
  process.env.MYSQL_PASSWORD || '1234',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

export default sequelize;
