const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.studentTarget.createMany({
      data: [
        { target: 'Regular' },
        { target: 'High Achiever' },
        { target: 'Lack Behind' },
      ],
    });

    console.log('Success');
  } catch (error) {
    console.log('Error seeding the database categories', error);
  } finally {
    await database.$disconnect();
  }
}

main();
