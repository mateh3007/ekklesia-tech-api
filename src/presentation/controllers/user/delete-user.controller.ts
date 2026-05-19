import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserUsecase } from 'src/application/usecases/user/delete-user.usecase';

@ApiTags('Users')
@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserUsecase: DeleteUserUsecase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async execute(@Param('id') id: string): Promise<void> {
    return this.deleteUserUsecase.execute(id);
  }
}
