import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    length: 250,
  })
  firstName: string;

  @Column({
    length: 250,
  })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  roles: string;
}
