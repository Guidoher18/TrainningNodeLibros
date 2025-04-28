import sequelize from '../config/db';
import dotenv from 'dotenv';
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

dotenv.config();

// Testeo la conexión a la base
// const testConnection = async (): Promise<boolean> => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     return true;
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     return false;
//   }
// };

// testConnection();

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT ?? '10'));
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
);

User.sync({ force: false });

export default User;
