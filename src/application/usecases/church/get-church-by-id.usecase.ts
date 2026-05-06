import { IChurch } from "src/domain/entities/church.entity";
import { ChurchRepository } from "src/domain/repositories/church.repository";

export class GetChurchByIdUsecase {
    constructor(private readonly churchRepository: ChurchRepository) {}

    async execute(id: string): Promise<IChurch> {
        return this.churchRepository.findById(id)
    }
}