import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';
import {
  ChurchRepository,
  CreateChurchInput,
} from 'src/domain/repositories/church.repository';
import { IChurch } from 'src/domain/entities/church.entity';

@Injectable()
export class PrismaChurchRepository extends ChurchRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchInput): Promise<IChurch> {
    return this.prisma.church.create({
      data: {
        corporateName: data.corporateName,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async findAll(): Promise<IChurch[]> {
    return this.prisma.church.findMany();
  }

  async findById(id: string): Promise<IChurch> {
    const church = await this.prisma.church.findUnique({ where: { id } });
    if (!church) throw new NotFoundException(`Church ${id} not found`);
    return church;
  }

  async update(id: string, data: IChurch): Promise<IChurch> {
    return this.prisma.church.update({
      where: { id },
      data: {
        corporateName: data.corporateName,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.church.delete({ where: { id } });
  }

  async findByCnpj(cnpj: string): Promise<IChurch | null> {
    return this.prisma.church.findUnique({ where: { cnpj } });
  }
}
