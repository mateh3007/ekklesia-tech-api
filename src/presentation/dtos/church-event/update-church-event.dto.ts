import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateChurchEventDto {
  @ApiPropertyOptional({ example: 'Retiro de Jovens' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Retiro anual da juventude' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2026-06-15T09:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: Date;
}
