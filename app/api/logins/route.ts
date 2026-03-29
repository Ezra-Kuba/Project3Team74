import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  loginPool?: Pool;
};

function getPool() {
  if (!globalForPg.loginPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.loginPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.loginPool;
}

async function findLoginByUsername(username: string) {
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM logins WHERE username = $1 LIMIT 1",
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const { username: _username, ...rest } = result.rows[0];
  return rest;
}

function getUsernameFromRequest(
  request: NextRequest,
  body?: { username?: unknown }
) {
  const queryUsername = request.nextUrl.searchParams.get("username");

  if (queryUsername) {
    return queryUsername;
  }

  if (typeof body?.username === "string") {
    return body.username;
  }

  return "";
}

export async function GET(request: NextRequest) {
  try {
    const username = getUsernameFromRequest(request);

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const login = await findLoginByUsername(username);

    if (!login) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(login);
  } catch (error) {
    console.error("Failed to fetch login row:", error);
    return NextResponse.json(
      { error: "Failed to fetch login row" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = getUsernameFromRequest(request, body);

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const login = await findLoginByUsername(username);

    if (!login) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(login);
  } catch (error) {
    console.error("Failed to fetch login row:", error);
    return NextResponse.json(
      { error: "Failed to fetch login row" },
      { status: 500 }
    );
  }
}
