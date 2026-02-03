import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const token = req.cookies.get("token")?.value;
    console.log("token:", token);

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    try {
        const res = await fetch(`${process.env.backend_url}/api/listing/user-listing?id=${id}`, {
            method: "DELETE",
            headers: {
                Cookie: `token=${token}`,
            },
        });
        if (!res.ok) {
            console.log("Failed to delete listing. Status:", res.status);
            return NextResponse.json({ error: "Failed to delete listing" }, { status: res.status });
        }
        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error deleting listing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}