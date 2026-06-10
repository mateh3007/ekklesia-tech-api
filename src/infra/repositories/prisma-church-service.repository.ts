import { Injectable } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import {
  ChurchServiceRepository,
  CreateChurchServiceInput,
  UpdateChurchServiceInput,
} from 'src/domain/repositories/church-service.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchServiceRepository extends ChurchServiceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchServiceInput): Promise<IChurchService> {
    return this.prisma.churchService.create({
      data,
    }) as Promise<IChurchService>;
  }

  async findAll(churchId: string): Promise<IChurchService[]> {
    return this.prisma.churchService.findMany({
      where: { churchId },
    }) as Promise<IChurchService[]>;
  }

  async findPaginated(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IChurchService>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.churchService.findMany({
        where: { churchId },
        skip,
        take: limit,
      }),
      this.prisma.churchService.count({ where: { churchId } }),
    ]);
    return {
      data: data as IChurchService[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<IChurchService | null> {
    const service = await this.prisma.churchService.findUnique({
      where: { id },
    });
    if (!service) return null;
    return service as IChurchService;
  }

  async update(
    id: string,
    data: UpdateChurchServiceInput,
  ): Promise<IChurchService> {
    return this.prisma.churchService.update({
      where: { id },
      data,
    }) as Promise<IChurchService>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.churchService.delete({ where: { id } });
  }
}
