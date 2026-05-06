import { BadRequestException, Injectable } from '@nestjs/common';
import { ChurchRepository } from 'src/domain/repositories/church.repository';

export interface IRegisterUsecaseInput {
    corporateName: string
    cnpj: string
    phone: string
    name: string
    email: string
    password: string
}

@Injectable()
export class RegisterUsecase {
    constructor(private readonly churchRepository: ChurchRepository) {}

    async execute(input: IRegisterUsecaseInput): Promise<void> {
        const churchAlreadyExists = await this.churchRepository.findByCnpj(input.cnpj);
        if (churchAlreadyExists) {
            throw new BadRequestException('Church already exists');
        }

        await this.churchRepository.create({
            corporateName: input.corporateName,
            cnpj: input.cnpj,
            phone: input.phone,
            email: input.email,
        });
    }
}