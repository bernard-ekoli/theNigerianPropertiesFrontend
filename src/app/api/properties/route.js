import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("Fetching all properties");
    try {
        const searchParam = req.nextUrl.searchParams.get("page");
        const page = Math.max(1, parseInt(searchParam || "1", 10) || 1);
        const res = await fetch(
            `${process.env.backend_url}/api/listing/all-listings?page=${page}`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch properties" },
                { status: res.status }
            );
        }
        const data = await res.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}