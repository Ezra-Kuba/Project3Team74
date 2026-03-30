import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  reportsPool?: Pool;
};

function getPool() {
  if (!globalForPg.reportsPool) {
    const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

    if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
      throw new Error("Database environment variables are not fully configured.");
    }

    globalForPg.reportsPool = new Pool({
      host: DATABASE_HOST,
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT || 5432),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.reportsPool;
}

async function runReport(reportType: string, timeStart?: string, timeEnd?: string) {
  const pool = getPool();

  switch (reportType) {
    case "total_sales_per_day":
      return pool.query(`
        SELECT
            DATE(order_timestamp) AS sales_day,
            COUNT(*) AS order_count,
            SUM(order_Total) AS total_sales
        FROM orders
        GROUP BY DATE(order_timestamp)
        ORDER BY sales_day;
      `);

    case "sales_report_by_time":
      if (!timeStart || !timeEnd) {
        throw new Error("Start and end timestamps are required for this report.");
      }

      return pool.query(
        `
        SELECT 
            oi.item_name,
            COUNT(*) AS units_sold,
            SUM(oi.item_price) AS total_sales
        FROM orders o
        JOIN order_items oi 
            ON o.order_id = oi.order_id
        WHERE o.order_timestamp BETWEEN CAST($1 AS timestamp) AND CAST($2 AS timestamp)
        GROUP BY oi.item_name
        ORDER BY total_sales DESC;
      `,
        [timeStart, timeEnd]
      );

    case "least_ordered_item":
      return pool.query(`
        SELECT
          item_name AS item_name,
          COUNT(*) AS times_ordered
        FROM order_items
        GROUP BY item_name
        ORDER BY times_ordered ASC, item_name
        LIMIT 1;
      `);

    case "top_selling":
      return pool.query(`
        SELECT 
            item_name AS item_name,
            COUNT(*) AS total_sold
        FROM order_items
        GROUP BY item_name
        ORDER BY total_sold DESC
        LIMIT 10;
      `);

    case "x_report":
      return pool.query(`
        SELECT 
            EXTRACT(HOUR FROM order_timestamp)::int AS hour_of_day,
            COUNT(*) AS orders_count,
            SUM(order_total) AS total_sales
        FROM orders
        WHERE order_timestamp::date = CURRENT_DATE
        GROUP BY 1
        ORDER BY hour_of_day;
      `);

    case "total_orders_and_sales_today":
      return pool.query(`
        SELECT
            COUNT(*) AS total_orders,
            SUM(order_total) AS total_sales,
            AVG(order_total) AS avg_order_value
        FROM orders
        WHERE order_timestamp::date = CURRENT_DATE;
      `);

    case "product_usage":
      if (!timeStart || !timeEnd) {
        throw new Error("Start and end timestamps are required for this report.");
      }

      return pool.query(
        `
        SELECT 
            TRIM(ingredient) AS inventory_item,
            COUNT(*) AS total_used
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN menu_items_list m ON oi.item_name = m.item_name
        CROSS JOIN LATERAL unnest(string_to_array(m.inventory_cost, ',')) AS ingredient
        WHERE o.order_timestamp BETWEEN CAST($1 AS timestamp) AND CAST($2 AS timestamp)
        GROUP BY inventory_item
        ORDER BY total_used DESC;
      `,
        [timeStart, timeEnd]
      );

    default:
      throw new Error("Invalid report type.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reportType = typeof body?.reportType === "string" ? body.reportType : "";
    const timeStart = typeof body?.timeStart === "string" ? body.timeStart : undefined;
    const timeEnd = typeof body?.timeEnd === "string" ? body.timeEnd : undefined;

    if (!reportType) {
      return NextResponse.json({ error: "reportType is required" }, { status: 400 });
    }

    const result = await runReport(reportType, timeStart, timeEnd);

    return NextResponse.json({ rows: result.rows });
  } catch (error) {
    console.error("Failed to fetch report:", error);
    const message = error instanceof Error ? error.message : "Failed to generate report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
