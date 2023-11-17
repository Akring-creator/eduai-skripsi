import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Option} from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import OptionForm from "./option";

interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; 
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface QuestionCardProps {
  initialData : Question
}

const QuestionCard = ( {initialData} :QuestionCardProps ) => {

    const [editing, setIsEditing] = useState({
      question : false,
      answer : false
    });

    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [value, setValue] = useState({
      question : initialData.question,
      answer : initialData.answer
    })
    const enableQuestionInput = async () =>{
      setIsEditing({
        ...editing,
        question : true
        
      });
      const response = await axios.get(`/api/question/${initialData.id}`)
    
      setTimeout(() => {
        setValue({
          ...value,
          question : response.data.question
          
        });
        inputRef.current?.focus();  
      }, 0);
    };


    const disableInput = async () => {
      
      setIsEditing({
        ...editing,
        question : false
        
      });
      const update = await axios.patch(`/api/question/${initialData.id}`, { question: value.question })

    }

    const onInput = async (newquestion: string) => {
      setValue({
          ...value,
          question : newquestion
        });
      // const update = await axios.patch(`/api/question/${initialData.id}`, { question: newquestion })
      // Hasil console.log(value)      
    }
 
    return ( 
    <div className="p-2">
      <div className="text-xl mb-4 w-full">
        {!editing.question ? (
            <div
            onClick={enableQuestionInput}
            className="outline-none font-bold ">
              {value.question}
            </div>

          ) : (
            <TextareaAutosize
            className="bg-transparent outline-none font-bold break-words w-full"
            ref={inputRef}
            value={value.question}
            onBlur={disableInput}
            onChange={(e) => onInput(e.target.value)}
            />

          )}
      </div>
          
          {initialData.options.map((option, index) => (
            <div key={index}>
              <OptionForm 
              optionId={option.id}
              optionValue={option.option}
               />
            </div>
          ))}



    </div>);
          
                    
        
}
 
export default QuestionCard;