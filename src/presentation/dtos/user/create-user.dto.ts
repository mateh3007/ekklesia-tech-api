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

  @ApiProperty({ enum: [Role.EMPLOYEE, Role.USER], example: Role.EMPLOYEE })
  @IsEnum([Role.EMPLOYEE, Role.USER])
  role: Role.EMPLOYEE | Role.USER;

  @ApiProperty({ example: 'uuid-da-igreja' })
  @IsString()
  churchId: string;
}
