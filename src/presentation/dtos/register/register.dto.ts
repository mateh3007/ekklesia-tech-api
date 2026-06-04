import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa Exemplo' })
  @IsString()
  corporateName: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678901234' })
  @IsString()
  cnpj: string;

  @ApiProperty({
    description: 'Telefone da empresa',
    example: '(11) 99999-9999',
  })
  @IsString()
  phone: string;
}
