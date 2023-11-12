import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuizCard } from "./_components/quiz-card";



const Generate = ({params}:{params : {quizId : string}}) => {
    
    return ( <div className="max-w-10xl mx-auto flex md:items-center md:justify-center h-full p-6">
        <QuizCard
        quizId={params.quizId} />

    </div> );
}
 
export default Generate;