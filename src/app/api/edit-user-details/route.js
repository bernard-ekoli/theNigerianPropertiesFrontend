import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
        return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    try {
        const body = await req.json()
        const { email, firstName, lastName, phone } = body
        console.log(email, firstName, lastName, phone)
        const user = await fetch(`${process.env.backend_url}/api/users/edit-user-details`, {
            headers: {
                Cookie: `token=${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({email, firstName, lastName, phone})
        })
        const res = await user.json()
        console.log("updated user response: ", res)
        return NextResponse.json({ success: true,});
    } catch (error) {
        console.log(error)
    }
}