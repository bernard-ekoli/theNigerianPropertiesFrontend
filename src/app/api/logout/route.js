import { NextResponse } from "next/server";


export async function GET(req, context) {
    try {
        const res = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        res.cookies.set("token", "", {
            maxAge: 0,
            path: "/",
            httpOnly: true,
            secure: true,
        });
        return res;
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}