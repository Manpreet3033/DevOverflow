import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY;
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

  const type = evt.type;

  if (type === "user.created") {
    const { data } = evt;
    /* eslint-disable */
    const { id, first_name, last_name, username, email_addresses, image_url } =
      data;

    const newUser = await createUser({
      clerkId: id,
      name: `${first_name} ${last_name}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({
      message: "ok",
      user: newUser,
    });

    /* eslint-enable */
  }

  if (type === "user.updated") {
    /* eslint-disable */
    const { id, image_url, first_name, last_name, username } = evt.data;

    const updatedUser = await updateUser({
      clerkId: id,
      updateData: {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username!,
        picture: image_url,
      },
      path: `/profile${id}`,
    });
    return NextResponse.json({
      message: "ok",
      user: updatedUser,
    });
    /* eslint-enable */
  }

  if (type === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await deleteUser({
      clerkId: id!,
    });
    return NextResponse.json({
      message: "ok",
      user: deletedUser,
    });
  }

  return new Response("ok", {
    status: 200,
  });
}
