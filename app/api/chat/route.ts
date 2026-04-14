import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function getApiKey() {
  const apiKey = process.env.google_api_key;

  if (!apiKey) {
    throw new Error("google_api_key is not configured.");
  }

  return apiKey;
}

function extractText(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const apiKey = getApiKey();
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are the Supa Yummi Boba website assistant. Keep answers short, helpful, and focused on menu, ordering, store info, and customer questions.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const apiError =
        data?.error?.message || data?.promptFeedback?.blockReason || "Gemini request failed.";

      return NextResponse.json({ error: apiError }, { status: response.status });
    }

    const reply = extractText(data);

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat request failed:", error);
    const message = error instanceof Error ? error.message : "Chat request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
