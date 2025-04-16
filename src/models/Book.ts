import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';

class Book extends Model {
  declare id: number;
  declare title: string;
  declare author: string;
  declare image_url: string;
  declare genre: string;
  declare publisher: string;
  declare pages: number;
  declare published_date: Date;
  declare sinopsis: string;
  declare reading_time: string;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sinopsis: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reading_time: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
    timestamps: true
  }
);

Book.sync({ force: false });

export default Book;
