import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import {
  ChurchServiceRepository,
  CreateChurchServiceInput,
  UpdateChurchServiceInput,
} from 'src/domain/repositories/church-service.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchServiceRepository extends ChurchServiceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchServiceInput): Promise<IChurchService> {
    return this.prisma.churchService.create({ data }) as Promise<IChurchService>;
  }

  async findAll(churchId: string): Promise<IChurchService[]> {
    return this.prisma.churchService.findMany({ where: { churchId } }) as Promise<IChurchService[]>;
  }

  async findById(id: string): Promise<IChurchService> {
    const service = await this.prisma.churchService.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`ChurchService ${id} not found`);
    return service as IChurchService;
  }

  async update(id: string, data: UpdateChurchServiceInput): Promise<IChurchService> {
    return this.prisma.churchService.update({ where: { id }, data }) as Promise<IChurchService>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.churchService.delete({ where: { id } });
  }
}
