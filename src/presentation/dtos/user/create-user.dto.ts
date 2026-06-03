import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/domain/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  phone: string;

  @ApiProperty({ enum: [Role.SUPERVISOR, Role.USER], example: Role.SUPERVISOR })
  @IsEnum(Role, { message: `role must be one of: ${Role.SUPERVISOR}, ${Role.USER}` })
  role: Role.SUPERVISOR | Role.USER;

}
