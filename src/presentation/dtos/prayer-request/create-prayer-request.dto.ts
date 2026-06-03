import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePrayerRequestDto {
  @ApiProperty({ example: 'Maria Oliveira' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pedido de cura para minha mãe que está internada.' })
  @IsString()
  request: string;
}
