const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.educationLevel.createMany({
      data: [
        { name: 'Sekolah Dasar', alias: 'SD', position: 1, groupLevel: 1 },
        { name: 'Madrasah Ibtidayah', alias: 'MI', position: 2, groupLevel: 1 },
        {
          name: 'Sekolah Dasar Luar Biasa',
          alias: 'SDLB',
          position: 3,
          groupLevel: 1,
        },
        {
          name: 'Sekolah Menengah Pertama',
          alias: 'SMP',
          position: 4,
          groupLevel: 2,
        },
        {
          name: 'Madrasah Tsanawiyah',
          alias: 'MTs',
          position: 5,
          groupLevel: 2,
        },
        {
          name: 'Sekolah Menengah Pertama Luar Biasa',
          alias: 'SMPLB',
          position: 6,
          groupLevel: 2,
        },
        {
          name: 'Sekolah Menengah Atas',
          alias: 'SMA',
          position: 7,
          groupLevel: 3,
        },
        {
          name: 'Madrasah Aliyah',
          alias: 'MA',
          position: 8,
          groupLevel: 3,
        },
        {
          name: 'Sekolah Menengah Atas Luar Biasa',
          alias: 'SMALB',
          position: 9,
          groupLevel: 3,
        },
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
