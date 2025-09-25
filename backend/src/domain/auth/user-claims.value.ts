export class UserClaims {
  constructor(
    public userId: number,
    public email: string,
    public roles: string[],
    public firstName: string,
    public lastName: string
  ) {}
}
