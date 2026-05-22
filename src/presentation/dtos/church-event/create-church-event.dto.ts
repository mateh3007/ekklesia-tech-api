import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateChurchEventDto {
  @ApiProperty({ example: 'Retiro de Jovens' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Retiro anual da juventude' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-06-15T09:00:00.000Z' })
  @IsDateString()
  date: Date;
}
