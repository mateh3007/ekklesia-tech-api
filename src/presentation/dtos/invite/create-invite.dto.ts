import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({ example: 'gestor@igreja.com' })
  @IsEmail()
  email: string;
}
