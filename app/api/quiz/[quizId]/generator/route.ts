import { NextResponse } from "next/server"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { multipleChoice } from "@/lib/openaimc";

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
    

    const questions = await multipleChoice(
        numberOfQuestions,
        numberOfOptions,
        materi,
        guidance,
        params.quizId
        )

    return NextResponse.json(questions)
    } catch (error) {
         console.log("[GENERATOR]", error);
            return new NextResponse("Internal Error", { status: 500 })
    }
    

    
    
    
}