const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.element.createMany({
      data: [
        {
          name: 'Keterampilan Proses',
          expectedOutcome:
            'Pada akhir fase, peserta didik terampil dalam membaca dan menuliskan tentang Konsep Dasar Ilmu Geografi, Peta, Penelitian Geografi dan Fenomena Geosfer. Peserta didik mampu menyampaikan, mengomunikasikan ide antar mereka, dan mampu bekerja secara kelompok atau pun mandiri dengan alat bantu hasil produk sendiri berupa peta atau alat pembelajaran lainnya.',
          learningOutcomeId: '96dd2e1e-ab1a-4394-b31f-4169b7c1b46e',
        },
        {
          name: 'Pemahaman Konsep',
          expectedOutcome:
            'Pada akhir fase, peserta didik mampu mengidentifikasi, memahami, berpikir kritis, dan menganalisa secara keruangan tentang Konsep Dasar Ilmu Geografi, Peta, Penelitian Geografi dan Lingkungan Geosfer, memaparkan ide, dan memublikasikannya di kelas atau pun media lain.',
          learningOutcomeId: '96dd2e1e-ab1a-4394-b31f-4169b7c1b46e',
        },
        {
          name: 'Keterampilan Proses',
          expectedOutcome:
            'Pada akhir fase, peserta didik terampil dalam membaca dan menuliskan tentang Posisi Strategis, Pola Keanekaragaman Hayati Indonesia dan Dunia, Kebencanaan dan Lingkungan Hidup, Kewilayahan dan Pembangunan, serta Kerja sama antar Wilayah. Peserta didik mampu menyampaikan mengomunikasikan ide antar mereka, dan mampu bekerja secara kelompok atau pun mandiri dengan alat bantu hasil produk sendiri berupa peta atau alat pembelajaran.',
          learningOutcomeId: '92e426aa-9a1a-4a79-9ae8-3dcf737d0cfd',
        },
        {
          name: 'Pemahaman Konsep',
          expectedOutcome:
            'Pada akhir fase, peserta didik mampu mengidentifikasi, memahami, mengolah dan menganalisis, serta mengevaluasi secara keruangan tentang Posisi Strategis, Pola Keanekaragaman Hayati Indonesia dan Dunia, Kebencanaan dan Lingkungan Hidup, Kewilayahan dan Pembangunan, serta Kerja sama antar Wilayah, memaparkan ide, dan memublikasikannya.',
          learningOutcomeId: '92e426aa-9a1a-4a79-9ae8-3dcf737d0cfd',
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
