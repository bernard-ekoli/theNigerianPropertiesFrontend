import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const body = await req.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const token = req.cookies.get("token")?.value;
    console.log("token:", token);

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    try {
        console.log("Params:", id);
        const res = await fetch(`${process.env.backend_url}/api/listing/user-listings?id=${id}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            console.log("Failed to update listing. Status:", res.status);
            return NextResponse.json({ error: "Failed to update listing", bodyRes }, { status: res.status });
        }
        const bodyRes = await res.json();
        console.log("Response from the editlisting backend:", bodyRes);
        return NextResponse.json({ message: "Listing updated successfully", data: bodyRes }, { status: 200 });
    } catch (error) {
        console.log("Error updating listing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}