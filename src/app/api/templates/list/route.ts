import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session"; // your session util

export async function GET() {
  const session = await getSession();
  if (!session?.isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Fetch only templates for this company
  const { data, error } = await supabase
    .from("batch_nfts")
    .select("id, product_name, product_description, nft_image_url")
    .eq("company_id", session.id)
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // Normalize keys for frontend
  const templates = (data || []).map((tpl) => ({
    id: tpl.id,
    product_name: tpl.product_name,
    description: tpl.product_description,
    image_url: tpl.nft_image_url,
  }));

  return NextResponse.json(templates);
}
