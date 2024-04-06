import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Please set the WEBHOOK_SECRET environment variable");
  }
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixTimestamp || !svixSignature || !svixId) {
    throw new Error(
      "svix-id, svix-timestamp, svix-signature are required headers"
    );
  }
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    }) as WebhookEvent;
  } catch (err) {
    console.log(err);
    throw new Response("Error occured", {
      status: 400,
    });
  }
  const { id } = evt.data;
  const type = evt.type;

  console.log(id + type);

  return new Response("", {
    status: 200,
  });
}
