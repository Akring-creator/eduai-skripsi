import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { LibrarySquare } from "lucide-react";
import Sidebar from "./_components/sidebar";
import { QuestionForm } from "./_components/question-form";

const QuizDraft = async (
    { params }:{params: {quizId : string}}
) => {

    // Memastikan Autentifikasi
    const { userId } = auth()

    if(!userId){
        return redirect("/");
    }

    const quiz = await db.quiz.findUnique({
        where : {
            id: params.quizId,
            userId : userId
        }, include: {
            questions : {
                orderBy : {
                    position : 'asc'
                }, include : {
                    options : true
                }
            }
        }
    })
    console.log(quiz)

    if (!quiz) {
        return redirect('/')
    }

    return ( <div>
        <div className="p-6">
            <div className="flex gap-6 mt-10">
                <div className="w-3/4 pr-4">
                    <QuestionForm 
                    initialData={quiz}
                    quizId={quiz.id}/>
                </div>
                <div className="w-1/4 pl-4">
                    <Sidebar
                    initialData={quiz}
                    quizId = {quiz.id} />
                </div>

            </div>
        </div>
    </div> );
}
 
export default QuizDraft;