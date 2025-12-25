import { User } from "../../../../../domain/auth/user.entity.ts";
import { UserEntity } from "../auth.models.ts";

export function mapUserDomainToModel(
  user: User,
  isUpdate: boolean = false
): UserEntity {
  const userEntity = new UserEntity();
  userEntity.id = user.id;
  userEntity.firstName = user.firstName;
  userEntity.lastName = user.lastName;
  userEntity.email = user.email;
  userEntity.password = user.password;
  userEntity.salt = user.salt;
  userEntity.roles = user.roles.join(",");
  return userEntity;
}

export function mapUserEntityToDomain(user: UserEntity): User {
  return new User(
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.salt,
    user.roles.split(",")
  );
}
