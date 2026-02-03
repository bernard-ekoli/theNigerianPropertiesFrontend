import { NextResponse } from "next/server";

export async function GET(req, context) {
    console.log("Fetching user properties");
    const cookies = req.headers.get("cookie") || "";
    try {
        const res = await fetch(
            `${process.env.backend_url}/api/listing/user-listings`,
            {
                method: "GET",
                headers: {
                    "Cookie": cookies,
                },
                cache: "no-store"
            },
        );
        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch user properties" },
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