import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAnnouncementDto {
  @ApiProperty({ example: 'Reunião de líderes', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Reunião de líderes nesta quinta-feira às 19h no salão principal.', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
