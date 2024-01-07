const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.learningModa.createMany({
      data: [{ moda: 'Luring' }, { moda: 'Daring' }, { moda: 'Hybrid' }],
    });

    console.log('Success');
  } catch (error) {
    console.log('Error seeding the database categories', error);
  } finally {
    await database.$disconnect();
  }
}

main();
