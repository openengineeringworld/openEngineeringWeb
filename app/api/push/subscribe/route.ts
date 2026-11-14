
import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";



const filePath = path.join(
  process.cwd(),
  "app",
  "data",
  "subscriptions.json"
);

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (
      !subscription.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    await mkdir(path.dirname(filePath), { recursive: true });

    let data = { subscriptions: [] as unknown[] };

    try {
      const file = await readFile(filePath, "utf-8");
      data = JSON.parse(file);
    } catch {
      // File does not exist yet.
    }

    const exists = data.subscriptions.some(
      (item: any) => item.endpoint === subscription.endpoint
    );

    if (!exists) {
      data.subscriptions.push(subscription);

      await writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription saved",
    });
  } catch (error) {
    console.error("Subscription error:", error);

    return NextResponse.json(
      { error: "Could not save subscription" },
      { status: 500 }
    );
  }
}
