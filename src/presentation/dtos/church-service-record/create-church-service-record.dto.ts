import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChurchServiceRecordDto {
  @ApiProperty({ example: 'uuid-do-culto', required: false })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({ example: 'Pr. João Silva' })
  @IsString()
  preacher: string;

  @ApiProperty({ example: 'A Graça de Deus' })
  @IsString()
  topic: string;

  @ApiProperty({ example: 'Efésios 2:8-9', required: false })
  @IsOptional()
  @IsString()
  bibleVerse?: string;

  @ApiProperty({ example: 'Culto muito abençoado', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2026-05-25T10:00:00.000Z' })
  @IsDateString()
  date: string;
}
