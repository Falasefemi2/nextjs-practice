/** @format */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // Validate credentials (example logic)
  if (email === "admin@example.com" && password === "admin123") {
    return NextResponse.json(
      { token: "admin-token", role: "admin" },
      { status: 200 }
    );
  }
  if (email === "user@example.com" && password === "user123") {
    return NextResponse.json(
      { token: "user-token", role: "user" },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
