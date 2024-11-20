/** @format */

import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

interface ErrorResponse {
  message: string;
}

export async function GET(req: Request) {
  // Extract the Authorization header
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (token === "admin-token") {
    const user: User = { id: 1, name: "Admin", role: "admin" };
    return NextResponse.json(user, { status: 200 });
  }

  if (token === "user-token") {
    const user: User = { id: 2, name: "User", role: "user" };
    return NextResponse.json(user, { status: 200 });
  }

  const error: ErrorResponse = { message: "Unauthorized" };
  return NextResponse.json(error, { status: 401 });
}
