import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, message, listingId } = body;
        console.log("listingId:", name, email, phone, message, listingId);
        const res = await fetch(
            `${process.env.backend_url}/api/send-agent-message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, phone, message, listingId })
            }
        );
        if (!res.ok) {
            return NextResponse.json(
                { status: res.status },
                { success: false },
                { message: "Failed to send message" }
            );
        }
        return NextResponse.json(
            { status: 200 },
            { success: true },
            { message: "Message sent successfully" }
        );
    } catch (error) {
        console.error("Error in send-agent-message route:", error);
        return NextResponse.json(
            { status: 500 },
            { success: false },
            { message: "Internal Server Error" }
        );
    }
}