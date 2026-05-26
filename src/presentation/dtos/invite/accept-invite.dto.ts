import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: '11999999999' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'MinhaS3nha@' })
  @IsString()
  @MinLength(8)
  password: string;
}
