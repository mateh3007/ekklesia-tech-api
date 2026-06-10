import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PixKeyType } from 'src/domain/enums/pix-key-type.enum';

export class UpdateChurchProfileDto {
  @ApiProperty({ example: 'Igreja Batista da Paz', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Uma comunidade cristã comprometida com o evangelho',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ example: '1990-03-15', required: false })
  @IsOptional()
  @IsDateString()
  foundedAt?: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'Brasil', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '01310-100', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: '(11) 3333-4444', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'contato@igreja.com', required: false })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ example: 'https://igreja.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: '@igrejaexemplo', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ example: 'facebook.com/igrejaexemplo', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ example: 'youtube.com/@igrejaexemplo', required: false })
  @IsOptional()
  @IsString()
  youtube?: string;

  @ApiProperty({ example: '12.345.678/0001-90', required: false })
  @IsOptional()
  @IsString()
  pixKey?: string;

  @ApiProperty({ enum: PixKeyType, required: false })
  @IsOptional()
  @IsEnum(PixKeyType)
  pixKeyType?: PixKeyType;
}
