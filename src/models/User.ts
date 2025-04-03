import sequelize from '../config/db';
import { DataTypes } from 'sequelize';

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

const User = sequelize.define('User', {
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
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

User.sync({ alter: true });

export default User;
