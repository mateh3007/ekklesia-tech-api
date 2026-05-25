import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';

export enum AgendaFilter {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class GetAgendaQueryDto {
  @ApiProperty({ enum: AgendaFilter, example: AgendaFilter.WEEK })
  @IsEnum(AgendaFilter)
  filter: AgendaFilter;

  @ApiProperty({ example: '2026-05-25' })
  @IsDateString()
  date: string;
}
