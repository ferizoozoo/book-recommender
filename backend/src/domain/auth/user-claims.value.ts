export class UserClaims {
     constructor(
        public userId: number,
        public email: string,
        public roles: string[],
        public firstname: string,
        public lastname: string,
    ){}
}