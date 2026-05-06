import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'John Doe'
    })
    @IsString()
    name: string

    @ApiProperty({
        description: 'Email do usuário',
        example: 'john.doe@example.com'
    })
    email: string

    @ApiProperty({
        description: 'Senha do usuário',
        example: '123456'
    })
    password: string

    @ApiProperty({
        description: 'Nome da empresa',
        example: 'Empresa Exemplo'
    })
    corporateName: string

    @ApiProperty({
        description: 'CNPJ da empresa',
        example: '12345678901234'
    })
    cnpj: string

    @ApiProperty({
        description: 'Telefone da empresa',
        example: '(11) 99999-9999'
    })
    phone: string
}