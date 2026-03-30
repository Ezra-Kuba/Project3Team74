import {NextResponse} from "next/server";
import { connect } from "node:http2";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function POST(req){
    try {
        const body = await req.json();
        const { items } = body;

        for (const item of items){
            await pool.query(
                "INSERT INTO orders (item_name, price) VALUES ($1, $2)",
                [item.itemName, item.price]
            );
        }
        return NextResponse.json({ message: "Order placed successfully." });
    } catch (error) {
        console.error("Error placing order:", error);
        return NextResponse.json({ error: "Failed to place order." }, { status: 500 });

    }
}