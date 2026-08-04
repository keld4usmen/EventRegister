const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@inspire.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
