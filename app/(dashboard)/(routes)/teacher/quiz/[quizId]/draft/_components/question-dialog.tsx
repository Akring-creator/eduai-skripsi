import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { Question } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface QuestionDialogProps {
    question : Question | ''
}

const questionSchema = z.object({
    question: z.string().min(1),
    explanation : z.string().min(10),
})


const QuestionDialog = () => {
    const form = useForm<z.infer<typeof questionSchema>>({
          resolver: zodResolver(questionSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = () => {

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
            Ubah soalmu baru klik simpan
          </DialogDescription>
        </DialogHeader>
            <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-4">
                <FormField 
                    control={form.control}
                    name="question"
                    render={({field}) => (
                    <FormItem>
                        <FormControl>
                                <Textarea 
                                disabled={isSubmitting}
                                placeholder="Tulis Pertanyaan di sini"
                                {...field}
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                        )} 
                        />
                    <FormField 
                    control={form.control}
                    name="explanation"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Penjelasan dari Jawaban
                            </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Penjelasan dari jawaban."
                                disabled={isSubmitting}
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}/>
                        <div className="flex items-center gap-x-2">
                        <Button
                        type="submit"
                        disabled = {!isValid || isSubmitting}>
                            Simpan
                        </Button>
                        </div>

                        </form>
                        
            </Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog> );
}
 
export default QuestionDialog;