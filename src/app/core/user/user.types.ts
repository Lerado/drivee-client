interface User {

  readonly id: number;

  name: string;
  email: string;
  roles: string[];

  readonly createdAt: number;
}

export {
  User
};
