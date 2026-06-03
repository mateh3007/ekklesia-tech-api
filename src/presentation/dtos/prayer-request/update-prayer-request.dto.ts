import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePrayerRequestDto {
  @ApiProperty({ example: 'Maria Oliveira', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Pedido de cura para minha mãe que está internada.', required: false })
  @IsOptional()
  @IsString()
  request?: string;
}
