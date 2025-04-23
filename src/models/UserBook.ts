import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';

class UserBook extends Model {
  declare id: number;
  declare userID: number;
  declare bookID: number;
}

UserBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'UserBook',
    tableName: 'UserBooks',
    timestamps: true
  }
);

UserBook.sync({ force: false });

export default UserBook;
