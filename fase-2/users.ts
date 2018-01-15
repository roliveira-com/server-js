export class User {
  constructor(
    public email: string,
    public name: string,
    private password: string
  ) {}

  matches(another: User) {
    return another !== undefined && another.email === this.email && another.password === this.password;
  }

};
                    // tipando constante 'users'
export const users: {[key: string]: User} = {
  'ro@ro.com': new User('ro@ro.com', 'Rodrigo', '1234ceara'),
  'zeh@zeh.com': new User('zeh@zeh.com', 'Zeh', '1234ceara')
};
