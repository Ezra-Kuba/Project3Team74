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

async function updateEmployee(employee) {
    const pool = getPool();
    const result = await pool.query(
        `
        UPDATE employee_list
        SET employee_name = $1, manager = $2, employee_password = $3
        WHERE employee_id_num = $4
        `,
        [employee.employee_name, employee.manager, employee.employee_password, employee.employee_id_num]
    );

    return result.rowCount;
}


export async function PUT(request: NextRequest) {
  const body = await request.json(); // Editable employee from frontend
  try {
    const updatedRows = await updateEmployee(body);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to update employee info:", error);
    return NextResponse.json(
      { error: "Failed to update employee info" },
      { status: 500 }
    );
  }
}
