import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";   
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : {params: {questionId : string}}) {
    try {
        const { userId } = auth();
        const { questionId } = params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const question = await db.question.findUnique({
            where : {
                id : questionId
            },

        })
        return NextResponse.json(question)

    } catch (error) {
        console.log("[QUESTION]", error)
        return new NextResponse("Internal Error", { status: 500})
    }

}
export async function PATCH(req: Request, {params} : {params: {questionId : string}}) {
    try {
        const { userId } = auth();
        const { questionId } = params
        const values = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        console.log(values)
        const question = await db.question.update({
            where : {
                id : questionId
            },
            data : {
                ...values
            }
        })
        return NextResponse.json(question)

    } catch (error) {
        console.log("[QUESTION]", error)
        return new NextResponse("Internal Error", { status: 500})
    }

}