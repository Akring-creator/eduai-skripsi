"use client";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Route } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";


interface DescriptionFormProps {
    initialData: Course;
    courseId : string;
};

const formSchema = z.object({
    description : z.string().min(1, {
        message: "Description is Required"
    }),
});


export const DescriptionForm = (
    {
        initialData,
        courseId
    }: DescriptionFormProps
) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ''
        }
});
const router = useRouter()
const [isEditing, setIsEditing] = useState(false)

const toggleEdit = () => setIsEditing((current) => !current)

const { isSubmitting, isValid } = form.formState;

const onSubmit = async (values: z.infer<typeof formSchema>) =>{
    try {
        const update = await axios.patch(`/api/courses/${courseId}`, values)
        toast.success('Berhasil mengubah deskripsi')
        toggleEdit()
        router.refresh()

        
    } catch {
        toast.error('Ada Masalah')
    }
    console.log(values)
}

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Deskripsi Kursus
                <Button onClick={toggleEdit}variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                    Ganti Deskripsi</>
                    )}
                    
                </Button>
                
            </div>
            {!isEditing && (
                    <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic" )}>
                        
                        {initialData.description || "Tidak ada deskripsi" }
                        
                    </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8">
                            <FormField 
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Textarea 
                                disabled={isSubmitting}
                                placeholder="Kursus ini tentang ...."
                                {...field}/>
                            </FormControl>
                            <FormDescription>
                                Ceritakan lebih lanjut tentang kursusmu
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} 
                        />
                        <div className="flex items-center gap-x-2">
                        <Button
                        type="submit"
                        disabled = {!isValid || isSubmitting}>
                            Simpan
                        </Button>
                        </div>

                        </form>
                        
                    </Form>
                    
                )}

        </div>
    )
}