import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { QuizTitleForm } from "./_components/quiz-title-form";

const CreateIdQuiz = async ({params}:{params : {quizId: string}}) => {

    // Mengecek apakah user yang mengakses adalah user yang sama
    const { userId } = auth()
    if(!userId){
        return redirect("/")
    }
    
    //Menelusuri Database untuk menemukan baris data
    const quiz = await db.quiz.findUnique({
        where : {
            id: params.quizId
        }
    })

    // Jika tidak ditemukan maka jangan lanjutkan
    if (!quiz) {
        return redirect("/")
    }

    // Mengambil/fetch data dari data yang ditemukan di database
    const requiredFields = [
        quiz.description,
        quiz.imageUrl,
        quiz.price,
        quiz.quizCategoryId,
        quiz.title,
    ]

    // Menghitung jumlah total data yang perlu diisi
    const totalFields = requiredFields.length;

    // Mengecek jumlah total data yang telah terisi
    const completedFields = requiredFields.filter(Boolean).length;

    // Memunculkan Progress ke UI
    const completionText = `(${completedFields}/${totalFields})`
    return ( 
        
    <div className="p-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                    Pengaturan File

                </h1>
                <span className="text-sm text-slate-700">
                    Isi semua data {completionText}
                </span>
            </div> 

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard}/>
                    <h2 className="text-xl">
                        Atur Filemu
                    </h2>

                </div>
                <QuizTitleForm
                initialData={quiz}
                quizId={quiz.id}/>
            </div>


        </div>
    </div> 
     );
}
 
export default CreateIdQuiz;