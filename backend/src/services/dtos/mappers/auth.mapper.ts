import { User } from "../../../domain/auth/user.entity.ts";
import { UserDto } from "../auth.dtos.ts";

export function mapUserDomainToDto(
  user: User,
  isUpdate: boolean = false
): UserDto {
  const userEntity = {} as UserDto;
  userEntity.id = user.id;
  userEntity.firstName = user.firstName;
  userEntity.lastName = user.lastName;
  userEntity.email = user.email;
  userEntity.password = user.password;
  userEntity.roles = user.roles;

  return userEntity;
}

export function mapUserDtoToDomain(user: UserDto): User {
  return new User(
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.roles.join(",")
  );
}
