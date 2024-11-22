class User {
  _id: string;
  username: string;
  email: string;
  password: string;
  authToken?: string;
  isAdmin?: boolean;

  constructor() {
    this.username = '';
    this.email = '';
  }
}

export default User;
