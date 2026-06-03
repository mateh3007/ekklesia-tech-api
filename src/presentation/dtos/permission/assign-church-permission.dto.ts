import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignChurchPermissionDto {
  @ApiProperty({ example: 'uuid-da-igreja' })
  @IsUUID()
  churchId: string;

  @ApiProperty({ example: 'uuid-da-permission' })
  @IsUUID()
  permissionId: string;
}
