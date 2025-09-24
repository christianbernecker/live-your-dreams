// PLACEHOLDER: API Route
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: "Operation completed" });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true, message: "Updated" });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: "Deleted" });
}
