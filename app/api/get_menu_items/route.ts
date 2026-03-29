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

async function getMenuItems(itemName?: string) {
  const pool = getPool();

  if (itemName) {
    const result = await pool.query(
      `
        SELECT item_name, price, inventory_cost
        FROM menu_items_list
        WHERE item_name = $1
        LIMIT 1
      `,
      [itemName]
    );

    return result.rows[0] ?? null;
  }

  const result = await pool.query(`
    SELECT item_name, price, inventory_cost
    FROM menu_items_list
    ORDER BY item_name ASC
  `);

  return result.rows;
}

export async function GET(request: NextRequest) {
  try {
    const itemName = request.nextUrl.searchParams.get("item_name") || undefined;
    const menuItems = await getMenuItems(itemName);

    if (itemName && !menuItems) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
