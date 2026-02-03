import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
export async function POST(req) {
    try {
        const body = await req.json()
        const user = await fetch(`${process.env.backend_url}/api/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: body.email, password: body.password })
        })

        const userRes = await user.json()
        console.log(userRes.user._id)
        if (!user.ok) {
            return NextResponse.json({ success: false }, { status: 400 })
        }


        const token = jwt.sign({ userId: userRes.user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const res = NextResponse.json(
            {
                success: true,
                user: userRes.user,
            },
            { status: 201 }
        );
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
        return res;

    } catch (error) {
        console.log(error)
    }
}