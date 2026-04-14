import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  ordersPool?: Pool;
};

function getPool() {
  if (!globalForPg.ordersPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.ordersPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.ordersPool;
}

type OrderItem = {
  itemName?: unknown;
  price?: unknown;
};

function normalizeItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one order item is required.");
  }

  return items.map((item) => {
    const nextItem = item as OrderItem;
    const itemName = typeof nextItem?.itemName === "string" ? nextItem.itemName.trim() : "";
    const parsedPrice = Number(nextItem?.price);

    if (!itemName) {
      throw new Error("Each order item must include an itemName.");
    }

    if (!Number.isFinite(parsedPrice)) {
      throw new Error(`Invalid price for item "${itemName}".`);
    }

    return {
      itemName,
      price: parsedPrice,
    };
  });
}

async function insertOrder(client: PoolClient, items: Array<{ itemName: string; price: number }>) {
  const orderTotal = items.reduce((sum, item) => sum + item.price, 0);

  const orderResult = await client.query(
    `
      INSERT INTO orders (order_timestamp, order_total)
      VALUES (CURRENT_TIMESTAMP, $1)
      RETURNING order_id
    `,
    [orderTotal]
  );

  const orderId = orderResult.rows[0]?.order_id;

  if (!orderId) {
    throw new Error("Failed to create order record.");
  }

  for (const item of items) {
    await client.query(
      `
        INSERT INTO order_items (order_id, item_name, item_price)
        VALUES ($1, $2, $3)
      `,
      [orderId, item.itemName, item.price]
    );
  }

  return { orderId, orderTotal };
}

export async function POST(request: NextRequest) {
  const pool = getPool();
  const client = await pool.connect();
  let transactionStarted = false;

  try {
    const body = await request.json();
    const items = normalizeItems(body?.items);

    await client.query("BEGIN");
    transactionStarted = true;
    const order = await insertOrder(client, items);
    await client.query("COMMIT");
    transactionStarted = false;

    return NextResponse.json({
      message: "Order placed successfully.",
      orderId: order.orderId,
      orderTotal: Number(order.orderTotal.toFixed(2)),
    });
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
    console.error("Error placing order:", error);

    const message =
      error instanceof Error ? error.message : "Failed to place order.";

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}
