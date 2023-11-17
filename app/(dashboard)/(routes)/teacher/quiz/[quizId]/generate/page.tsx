import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuizCard } from "./_components/generate-card";



const Generate = ({params}:{params : {quizId : string}}) => {
    
    return ( <div className="w-[900px] mx-auto flex md:items-center md:justify-center h-full p-6">
        <QuizCard
        quizId={params.quizId} />

    </div> );
}
 
export default Generate;