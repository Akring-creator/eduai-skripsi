import { strict_output } from "@/lib/gpt"
import { NextResponse } from "next/server"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

interface IDictionary {
    [key: string]: string;
}

interface QuestionsFormat {
  question: string;
  answer: string;
  explanation: string;
  quizId: string;
  options: string[];
}

export const POST = async (req: Request, {params} : {params : {quizId: string}}) => 
{
    try {
        const { userId } = auth();

            if(!userId) {
                return new NextResponse("Unathourized", {status: 401});
            }

            const quizOwner = await db.quiz.findUnique({
                where: {
                    id: params.quizId,
                    userId: userId
                }
            })

            if (!quizOwner) {
                return new NextResponse("Unauthorized", {status:401})
            }

        const {materi, numberOfQuestions, numberOfOptions, guidance} = await req.json()
    const jsonFormat: IDictionary = {
        question: "Pertanyaan",
        answer: 'Jawaban yang benar',
        explanation: "Pembahasan dari Jawaban yang benar",
        
    }
    for (let i= 1; i <= numberOfOptions; i++) {
        const option = `option${i}`
        jsonFormat[option] = `Pilihan Jawaban ke ${i}`
    }

    const question = await strict_output(
        "Kamu adalah sebuah AI yang dapat membuat soal dan pertanyaan dan memasukkannya kedalam JSON",
        new Array(numberOfQuestions).fill(
            `buatlah pertanyaan pilihan ganda dari materi berikut: ${materi}, dengan ketentuan: jawaban yang benar harus menjadi salah satu pilihan jawaban, panjang kalimat antar pilihan jawaban harus mendekati atau sama panjang, ${guidance}` 
        ),
        jsonFormat
    )
    const generateQuestions: QuestionsFormat[] = question.map((item : any) => {

        const options = [];
        for (let i = 1; i <= numberOfOptions; i++) {
            const optionKey = `option${i}`;
            if (item[optionKey]) {
            options.push(item[optionKey]);
            }
        }
        return {
            question: item.question,
            answer: item.answer,
            explanation: item.explanation,
            quizId : params.quizId,
            options,
        };
    });
    return NextResponse.json(generateQuestions)
    } catch (error) {
         console.log("[GENERATOR]", error);
            return new NextResponse("Internal Error", { status: 500 })
    }
    

    
    
    
}