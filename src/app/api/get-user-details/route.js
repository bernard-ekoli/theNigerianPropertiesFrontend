import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    try {
        const userResponse = await fetch(`${process.env.backend_url}/api/users/`, {
            headers: { Cookie: `token=${token}` },
        });

        if (userResponse.status === 404) {
            return NextResponse.json({ success: false, message: 'User does not exist' }, { status: 404 });
        }

        if (!userResponse.ok) {
            // Other server errors
            console.error('Upstream server error:', userResponse.status);
            return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
        }

        const userData = await userResponse.json();
        return NextResponse.json(userData);

    } catch (error) {
        console.error('Network or fetch error:', error);
        return NextResponse.json({ success: false, message: 'Network error, try again later' }, { status: 503 });
    }
}
