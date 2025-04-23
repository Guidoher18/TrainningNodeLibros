import Book from './Book';
import User from './User';
import UserBook from './UserBook';
// import sequelize from '../config/db';

// Registrar todos los modelos aquí
const models = {
  User,
  Book,
  UserBook
};

// TODO: Revisar no funciona
// Configurar asociaciones si las hay
// Object.values(models).forEach((model) => {
//   if (model.associate) {
//     model.associate(models);
//   }
// });

// export { sequelize };
export default models;
