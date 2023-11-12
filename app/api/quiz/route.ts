import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Untuk buat pertama kali Kuisnya
export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const quiz = await db.quiz.create({
            data: {
                userId,
                title
            }
        })
        return NextResponse.json(quiz)
    } catch (error) {
        console.log("[Courses]", error)
        return new NextResponse("Internal Error", { status: 500})
        
    }
    
}