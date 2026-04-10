// app/api/ask/route.ts

import { NextRequest, NextResponse } from "next/server";

// Use fetch directly to Groq's OpenAI‑compatible API
async function callAI(question: string): Promise<string> {
  console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY); // debug line
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment");
  }

  const systemPrompt = `
You are AskBizAI, a friendly AI business advisor for small‑business owners worldwide (shops, tuition centers, clinics, home‑based services, etc.).

Always do:
- Give 3‑step, practical, low‑cost action plans in simple English.
- Assume the user has limited budget and no marketing team.
- Use examples relevant to small businesses (social media, Google, WhatsApp, local word‑of‑mouth, etc.).
- If the question is about regulations (tax, licenses, etc.), add a short disclaimer: "This is general guidance, not legal advice."

Never:
- Write long essays or technical jargon.
- Recommend expensive tools or complex strategies.

Format:
- Start with a short one‑sentence summary.
- Then list:
  1. Step 1
  2. Step 2
  3. Step 3
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Groq error: ${res.status} ${err.error?.message || ""}`);
  }

  const data = await res.json();
  return data.choices[0].message.content?.trim() || "No answer from AI.";
}

export async function POST(req: NextRequest) {
  const { question, email } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid question" },
      { status: 400 }
    );
  }

  console.log("New user:", { email, question });

  try {
    const answer = await callAI(question);
    return NextResponse.json({ answer }, { status: 200 });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err && "message" in err
        ? String(err.message)
        : "Unknown error";

    return NextResponse.json(
      { error: "AI call failed: " + message },
      { status: 500 }
    );
  }
}