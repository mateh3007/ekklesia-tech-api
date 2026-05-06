import { Controller, Get, Param } from "@nestjs/common";
import { IChurch } from "src/domain/entities/church.entity";
import { GetChurchByIdUsecase } from "src/application/usecases/church/get-church-by-id.usecase";

@Controller('church')
export class GetChurchByIdController {
    constructor(private readonly getChurchByIdUsecase: GetChurchByIdUsecase) {}

    @Get(':id')
    async execute(@Param('id') id: string): Promise<IChurch> {
        return this.getChurchByIdUsecase.execute(id)
    }
}