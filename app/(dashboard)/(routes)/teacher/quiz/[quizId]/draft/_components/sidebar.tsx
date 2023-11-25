"use client";
import { Button } from "@/components/ui/button";
import { Quiz } from "@prisma/client";
import { ArrowRightToLine, HardDriveUpload, PenSquare, Pencil, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    initialData : Quiz,
    quizId : string
}

export const Sidebar = ({
    initialData,
    quizId
}: SidebarProps) => {

    const router = useRouter()
    const onClick = () => {
        router.push(`/teacher/quiz/${initialData.id}/generate`)
    }
    const onClickExport = () => {
        // Jalankan fungsi pembuatan file Word
        
    }
    return ( 
    <>
    {/* Kolom kedua dengan lebar 1/3 layar */}
    <div className="bg-gray-200 p-4 rounded">
        {/* Wadah untuk gambar */}
        <div className="mb-4">
            <img src={initialData.imageUrl ? initialData.imageUrl : ''} 
            alt="Gambar" className="w-full h-auto rounded" />
        </div>
        {/* Tempat judul */}
        <h2 className="text-xl font-semibold mb-2">
            {initialData.title}
        </h2>
        {/* Tempat deskripsi */}
        <p className="text-gray-700">
            {initialData.description}</p>
        <span className="text-sm text-slate-700">Terakhir diubah: {initialData.updateAt.toDateString()}</span>
    </div>
    {/* Tombol Bertuliskan Buat Soal */}
    <br></br>
    <div className="px-4 py-2 rounded flex items-center justify-center space-x-2">
        <Button
    type="button"
    variant="secondary"
    onClick={onClick}>
        <Pencil name="pencil" className="mr-2" />
        Buat Soal
    </Button>
    <Button
    type="button"
    variant="secondary">
        <Settings name="settings" className="mr-2" />
        Setting
    </Button>
    <Button
    type="button"
    variant="secondary"
    onClick={onClickExport}>
        <ArrowRightToLine className="mr-2" />
        Export
    </Button>
    </div>
    
    

    </>
     );
}
 
export default Sidebar;