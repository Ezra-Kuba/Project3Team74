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

async function getInventoryItems(inventoryItem?: string) {
  const pool = getPool();

  if (inventoryItem) {
    const result = await pool.query(
      `
        SELECT inventory_item, stock
        FROM inventory
        WHERE inventory_item = $1
        LIMIT 1
      `,
      [inventoryItem]
    );

    return result.rows[0] ?? null;
  }

  const result = await pool.query(`
    SELECT inventory_item, stock
    FROM inventory
    ORDER BY inventory_item ASC
  `);

  return result.rows;
}

export async function GET(request: NextRequest) {
  try {
    const inventoryItem =
      request.nextUrl.searchParams.get("inventory_item") || undefined;
    const inventoryItems = await getInventoryItems(inventoryItem);

    if (inventoryItem && !inventoryItems) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Failed to fetch inventory items:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory items" },
      { status: 500 }
    );
  }
}
