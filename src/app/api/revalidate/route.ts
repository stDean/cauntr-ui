// app/api/revalidate/route.ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");

  // Revalidate the specified cache tag
  if (tag) {
    if (tag in CACHE_TAGS) {
      revalidateDbCache({ tag: CACHE_TAGS[tag as keyof typeof CACHE_TAGS] });
    }
  }

  // Redirect back to the settings page with a success flag
  return NextResponse.redirect(
    new URL(`/settings?q=billing&success=true`, request.url)
  );
}
