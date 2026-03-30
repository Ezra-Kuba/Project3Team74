import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  employeesPool?: Pool;
};

function getPool() {
  if (!globalForPg.employeesPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.employeesPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.employeesPool;
}

async function getEmployees(employeeName?: string) {
  const pool = getPool();

  if (employeeName) {
    const result = await pool.query(
      `
        SELECT employee_id_num, manager, employee_name, employee_password
        FROM employee_list
        WHERE employee_name = $1
        LIMIT 1
      `,
      [employeeName]
    );

    return result.rows[0] ?? null;
  }

  const result = await pool.query(`
    SELECT employee_id_num, manager, employee_name, employee_password
    FROM employee_list
    ORDER BY manager DESC
  `);

  return result.rows;
}

export async function GET(request: NextRequest) {
  try {
    const employeeName = request.nextUrl.searchParams.get("employee_name") || undefined;
    const employeeList = await getEmployees(employeeName);

    if (employeeName && !employeeList) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employeeList);
  } catch (error) {
    console.error("Failed to fetch employee info:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee info" },
      { status: 500 }
    );
  }
}
