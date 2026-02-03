import { NextResponse } from "next/server";

export async function GET(req, context) {
    const { id } = await context.params;
    console.log("Fetching property with ID:", id);
    console.log("ID", id);

    try {
        const res = await fetch(
            `${process.env.backend_url}/api/listing/get-property?id=${id}`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
