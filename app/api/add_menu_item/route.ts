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

async function addMenuItem(item) {
    const pool = getPool();
    const result = await pool.query(
        `
        INSERT INTO menu_items_list (item_name, price, inventory_cost)
        VALUES ($1, $2, $3)
        `,
        [item.item_name, item.price, item.inventory_cost]
    );

    return result.rowCount;
}


export async function POST(request: NextRequest) {
  const body = await request.json(); // New menu item from frontend
  try {
    const updatedRows = await addMenuItem(body);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to add new menu item:", error);
    return NextResponse.json(
      { error: "Failed to add new menu item" },
      { status: 500 }
    );
  }
}
