import User from '../models/User';

const userToDto = (user: User | User[]) => {
  const convertToDto = (user: User) => ({
    id: user.id,
    username: user.username,
    email: user.email
  });

  const objs = [];

  if (Array.isArray(user)) {
    user.forEach((u) => {
      objs.push(convertToDto(u));
    });
  } else {
    objs.push(convertToDto(user));
  }

  return objs.length > 1 ? objs : objs[0];
};

export default userToDto;
