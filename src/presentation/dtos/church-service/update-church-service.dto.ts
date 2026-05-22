import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Day } from 'src/domain/enums/day.enu';

export class UpdateChurchServiceDto {
  @ApiPropertyOptional({ example: 'Culto de Domingo' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Culto principal da semana' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: Day, example: Day.SUNDAY })
  @IsEnum(Day)
  @IsOptional()
  day?: Day;

  @ApiPropertyOptional({ example: '09:00' })
  @IsString()
  @IsOptional()
  startsAt?: string;

  @ApiPropertyOptional({ example: '11:00' })
  @IsString()
  @IsOptional()
  endsAt?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @ApiPropertyOptional({ example: 'https://youtube.com/live/abc' })
  @IsString()
  @IsOptional()
  streamUrl?: string;
}
