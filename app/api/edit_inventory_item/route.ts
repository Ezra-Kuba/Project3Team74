import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  inventoryPool?: Pool;
};

function getPool() {
  if (!globalForPg.inventoryPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.inventoryPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.inventoryPool;
}

async function updateInventoryItem(item, ogName) {
    const pool = getPool();
    const result = await pool.query(
        `
        UPDATE inventory
        SET inventory_item = $1, stock = $2
        WHERE inventory_item = $3
        `,
        [item.inventory_item, item.stock, ogName]
    );

    return result.rowCount;
}


export async function PUT(request: NextRequest) {
  const body = await request.json(); // Editable menu item from frontend
  try {
    const {ogName, ...item} = body;
    const updatedRows = await updateInventoryItem(item, ogName);
    return NextResponse.json({success: true, updatedRows});
  } catch (error) {
    console.error("Failed to update inventory item:", error);
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}
