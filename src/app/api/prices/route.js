import { NextResponse } from "next/server";

export async function GET() {
    const res = await fetch(`${process.env.backend_url}/api/prices`);
    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json({
            success: false,
            error: data.error || 'Failed to fetch prices'
        }, { status: res.status });
    }

    return NextResponse.json({
        success: true,
        data: data.data
    });
}
