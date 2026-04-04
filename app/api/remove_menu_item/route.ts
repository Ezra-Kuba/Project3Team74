import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  menuItemsPool?: Pool;
};

function getPool() {
  if (!globalForPg.menuItemsPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.menuItemsPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.menuItemsPool;
}

async function removeMenuItem(item) {
    const pool = getPool();
    const result = await pool.query(
        `
        DELETE FROM menu_items_list
        WHERE item_name = $1
        `,
        [item.item_name]
    );

    return result.rowCount;
}


export async function DELETE(request: NextRequest) {
  const body = await request.json(); // Target item from frontend
  try {
    const updatedRows = await removeMenuItem(body);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to remove menu item:", error);
    return NextResponse.json(
      { error: "Failed to remove menu item" },
      { status: 500 }
    );
  }
}
