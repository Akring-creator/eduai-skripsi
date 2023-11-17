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
interface QuestionDialogProps {
  initialData : Question
}

const QuestionDialog = ( {initialData} :QuestionDialogProps ) => {

    const [editing, setIsEditing] = useState({
      question : false,
      answer : false
    });

    const inputRef = useRef<ElementRef<"textarea">>(null);
    const answerInputRef = useRef<ElementRef<"textarea">>(null);
    const [value, setValue] = useState({
      question : initialData.question,
      answer : initialData.answer
    })
    const enableQuestionInput = () =>{
      setIsEditing({
        ...editing,
        question : true
        
      });
    
      setTimeout(() => {
        setValue({
          ...value,
          question : initialData.question
          
        });
        inputRef.current?.focus();  
      }, 0);
    };
    const enableAnswerInput = () =>{
      setIsEditing({
        ...editing,
        answer : true
        
      });
      setTimeout(() => {
        setValue({
          ...value,
          answer : initialData.answer
          
        });
        answerInputRef.current?.focus();  
      }, 0);
    }

    const disableInput = () => setIsEditing({
        ...editing,
        question : false
        
      })
    const disableAnswerInput = () => setIsEditing({
        ...editing,
        answer: false
        
      })
    const onInput = async (newquestion: string) => {
      setValue({
          ...value,
          question : newquestion
        });
      // Hasil console.log(value)
      const update = await axios.patch(`/api/question/${initialData.id}`, { question: value.question })
      
    }
    const answerOnInput = async (newanswer: string) => {
      setValue({
          ...value,
          answer : newanswer
        });
      // Hasil console.log(value)
      const update = await axios.patch(`/api/question/${initialData.id}`, { answer: value.answer })
      
    }
 
    return ( 
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Ubah Soal 
            </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Ubah Soal</DialogTitle>
          <DialogDescription>
            Perubahan tersimpan otomatis
          </DialogDescription>
        </DialogHeader>
          {!editing.question ? (
            <div
            onClick={enableQuestionInput}
            className="outline-none font-bold">
              {value.question}
            </div>

          ) : (
            <TextareaAutosize
            className="bg-transparent outline-none font-bold break-words"
            ref={inputRef}
            value={value.question}
            onBlur={disableInput}
            onChange={(e) => onInput(e.target.value)}
            />

          )}
          {initialData.options.map((option, index) => (
            <div key={index}>
              <OptionForm 
              optionValue={option.option}
              optionId={option.id} />
            </div>
          ))}

          {!editing.answer ? (
            <div
            onClick={enableAnswerInput}
            className="outline-none font-medium">
              {value.answer}
            </div>

          ) : (
            <TextareaAutosize
            className="bg-transparent outline-none font-medium break-words"
            ref={answerInputRef}
            value={value.answer}
            onBlur={disableAnswerInput}
            onChange={(e) => answerOnInput(e.target.value)}
            />

          )}
          
                    
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog> );
}
 
export default QuestionDialog;