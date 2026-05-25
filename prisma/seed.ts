import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  let church = await prisma.church.findUnique({ where: { cnpj: '00000000000000' } });

  if (!church) {
    church = await prisma.church.create({
      data: {
        corporateName: 'Ekklesia Platform',
        cnpj: '00000000000000',
        email: 'platform@ekklesia.com',
        phone: '00000000000',
      },
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: 'superadmin@gmail.com' } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('Re851120@', 10);
    await prisma.user.create({
      data: {
        name: 'Superadmin',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        phone: '00000000000',
        role: 'SUPERADMIN',
        churchId: church.id,
      },
    });
    console.log('Superadmin user created.');
  }

  const serviceCount = await prisma.churchService.count({ where: { churchId: church.id } });
  if (serviceCount === 0) {
    await prisma.churchService.createMany({
      data: [
        {
          churchId: church.id,
          title: 'Culto Dominical',
          description: 'Culto principal da semana',
          day: 'SUNDAY',
          startsAt: '10:00',
          endsAt: '12:00',
          isOnline: false,
        },
        {
          churchId: church.id,
          title: 'Culto de Quarta',
          description: 'Culto de oração e ensino',
          day: 'WEDNESDAY',
          startsAt: '19:30',
          endsAt: '21:00',
          isOnline: false,
        },
        {
          churchId: church.id,
          title: 'Culto Online de Sexta',
          description: 'Transmissão ao vivo',
          day: 'FRIDAY',
          startsAt: '20:00',
          endsAt: '21:30',
          isOnline: true,
          streamUrl: 'https://youtube.com/live/ekklesia',
        },
      ],
    });
    console.log('Church services seeded.');
  }

  const eventCount = await prisma.churchEvent.count({ where: { churchId: church.id } });
  if (eventCount === 0) {
    await prisma.churchEvent.createMany({
      data: [
        {
          churchId: church.id,
          title: 'Retiro de Jovens',
          description: 'Retiro anual da juventude',
          date: new Date('2026-05-28T08:00:00.000Z'),
        },
        {
          churchId: church.id,
          title: 'Conferência de Mulheres',
          description: 'Evento especial para mulheres da igreja',
          date: new Date('2026-06-06T14:00:00.000Z'),
        },
        {
          churchId: church.id,
          title: 'Batismo de Novos Membros',
          description: 'Cerimônia de batismo',
          date: new Date('2026-05-31T11:00:00.000Z'),
        },
      ],
    });
    console.log('Church events seeded.');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
