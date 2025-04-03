import User from './User';
import sequelize from '../config/db';

// Registrar todos los modelos aquí
const models = {
  User
};

// TODO: Revisar no funciona
// Configurar asociaciones si las hay
// Object.values(models).forEach((model) => {
//   if (model.associate) {
//     model.associate(models);
//   }
// });

export { sequelize };
export default models;
