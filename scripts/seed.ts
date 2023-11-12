const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function getAllQuestions() {
  const questions = await db.quiz.findMany();
  return questions;
}

getAllQuestions()
  .then((questions) => {
    console.log("Seluruh data dari tabel Question:");
    console.log(questions);
  })
  .catch((error) => {
    console.error("Terjadi kesalahan:", error);
  })
  .finally(async () => {
    await db.$disconnect();
  });
