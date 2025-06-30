import { NextResponse } from "next/server";
import { generateCoverLetter, getCoverLetters, getCoverLetter, deleteCoverLetter} from "./actions/cover-letter";

// POST /api/cover-leter.js/route.js
export async function POST(req) {
try {
    const data = await req.json();
    const coverLetter = await generateCoverLetter(data);
    return NextResponse.json(coverLetter, { status: 201 });
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
}
}

// GET /api/cover-leter.js/route.js
export async function GET() {
try {
    const coverLetters = await getCoverLetters();
    return NextResponse.json(coverLetters);
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
}
}

// GET /api/cover-leter.js/route.js?id=...
export async function GET_ONE(req) {
try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const coverLetter = await getCoverLetter(id);
    if (!coverLetter)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(coverLetter);
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
}
}

// DELETE /api/cover-leter.js/route.js?id=...
export async function DELETE(req) {
try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const deleted = await deleteCoverLetter(id);
    return NextResponse.json(deleted);
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
}
}