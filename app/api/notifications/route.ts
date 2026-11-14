


import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "notifications.json"
    );

    const file = await readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(file);

    if (!Array.isArray(data)) {
      throw new Error("Invalid notifications data.");
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load notifications:", error);

    return NextResponse.json(
      { error: "Unable to load notifications." },
      { status: 500 }
    );
  }
}
