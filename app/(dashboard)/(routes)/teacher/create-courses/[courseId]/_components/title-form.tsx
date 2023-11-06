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
import { Pencil, Route } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface TitleFormProps {
    initialData: {
        title: string;
    };
    courseId : string;
};

const formSchema = z.object({
    title : z.string().min(1, {
        message: "This is Required"
    }),
});


export const TitleForm = (
    {
        initialData,
        courseId
    }: TitleFormProps
) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
});
const router = useRouter()
const [isEditing, setIsEditing] = useState(false)

const toggleEdit = () => setIsEditing((current) => !current)

const { isSubmitting, isValid } = form.formState;

const onSubmit = async (values: z.infer<typeof formSchema>) =>{
    try {
        const update = await axios.patch(`/api/courses/${courseId}`, values)
        toast.success('Nama berhasil diubah')
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
                Judul Kursus
                <Button onClick={toggleEdit}variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                    Edit Judul</>
                    )}
                    
                </Button>
                
            </div>
            {!isEditing && (
                    <p className="text-sm mt-2">
                        {initialData.title}
                    </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8">
                            <FormField 
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                disabled={isSubmitting}
                                placeholder="cth: Ulangan Harian Kalkulus"
                                {...field}/>
                            </FormControl>
                            <FormDescription>
                                Apa yang ingin kamu ajarkan?
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