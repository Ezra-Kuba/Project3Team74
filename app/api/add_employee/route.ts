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

async function addEmployee(employee) {
    const pool = getPool();
    const result = await pool.query(
        // Assign lowest ID currently not in use to new employee
        `
        INSERT INTO employee_list (employee_id_num, employee_name, manager, employee_password)
        VALUES (
            (
                SELECT MIN(t.id)
                FROM generate_series(0, (SELECT MAX(employee_id_num) + 1 FROM employee_list)) AS t(id)
                WHERE t.id NOT IN (SELECT employee_id_num FROM employee_list)
            ),
            $1, $2, $3
        )
        `,
        [employee.employee_name, employee.manager, employee.employee_password]
    );

    return result.rowCount;
}


export async function POST(request: NextRequest) {
  const body = await request.json(); // New employee from frontend
  try {
    const updatedRows = await addEmployee(body);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to add new employee:", error);
    return NextResponse.json(
      { error: "Failed to add new employee" },
      { status: 500 }
    );
  }
}
