import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Day } from 'src/domain/enums/day.enu';

export class CreateChurchServiceDto {
  @ApiProperty({ example: 'Culto de Domingo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Culto principal da semana' })
  @IsString()
  description: string;

  @ApiProperty({ enum: Day, example: Day.SUNDAY })
  @IsEnum(Day)
  day: Day;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startsAt: string;

  @ApiProperty({ example: '11:00' })
  @IsString()
  endsAt: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isOnline: boolean;

  @ApiPropertyOptional({ example: 'https://youtube.com/live/abc' })
  @IsString()
  @IsOptional()
  streamUrl?: string;
}
