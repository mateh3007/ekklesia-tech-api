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

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
