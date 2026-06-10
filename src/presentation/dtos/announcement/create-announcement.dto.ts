import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Reunião de líderes' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Reunião de líderes nesta quinta-feira às 19h no salão principal.',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  @IsDateString()
  date: string;
}
