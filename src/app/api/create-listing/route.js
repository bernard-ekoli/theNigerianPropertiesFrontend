import { cookies } from 'next/headers'; // This is allowed here (Server)
import { NextResponse } from 'next/server';

// ... imports

export async function POST(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const body = await req.json();

        const res = await fetch(`${process.env.backend_url}/api/listing/create-listing`, {
            method: 'POST',
            headers: {
                Cookie: `token=${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...body
            }),

        })
        const bodyRes = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: bodyRes.message || 'Failed to create listing' },
                { status: res.status }
            );
        }
        console.log("This is req.body:", bodyRes);

        return NextResponse.json(bodyRes, { status: 200 });
    } catch (error) {
        // Log the actual error for debugging
        console.error('Listing creation error:', error);

        // Return a valid NextResponse with status 500
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}