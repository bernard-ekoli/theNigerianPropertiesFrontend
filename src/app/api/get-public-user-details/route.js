import { NextResponse } from 'next/server';

export async function GET(req, context) {
    try {
        const agentId = req.nextUrl.searchParams.get('agentId');
        const res = await fetch(`${process.env.backend_url}/api/users/public-info?agentId=${agentId}`, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json({ message: 'User not found' }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}