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

async function updateMenuItem(item, ogName) {
    const pool = getPool();
    const result = await pool.query(
        `
        UPDATE menu_items_list
        SET item_name = $1, price = $2, inventory_cost = $3
        WHERE item_name = $4
        `,
        [item.item_name, item.price, item.inventory_cost, ogName]
    );

    return result.rowCount;
}


export async function PUT(request: NextRequest) {
  const body = await request.json(); // Editable employee from frontend
  try {
    const {ogName, ...item} = body;
    const updatedRows = await updateMenuItem(item, ogName);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}
