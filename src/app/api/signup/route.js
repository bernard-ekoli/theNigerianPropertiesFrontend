import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
export async function POST(req) {
    try {
        const body = await req.json();
        const res = await fetch(`${process.env.backend_url}/api/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Signup failed" },
                { status: res.status }
            );
        }
        const token = jwt.sign({ userId: data.user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const response = NextResponse.json(
            {
                success: true,
                user: data.user,
            },
            { status: 201 }
        );
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
        });
        return response;
        
    } catch (error) {
        console.log("Error in signup route:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
