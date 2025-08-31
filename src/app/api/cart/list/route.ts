import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session?.isLoggedIn) {
    return NextResponse.json([], { status: 401 });
  }

  const { data, error } = await supabase
    .from("cart")
    .select(`
      id,
      nft_id,
      quantity,
      batch_nfts (product_name, product_description, nft_image_url)
    `)
    .eq("company_id", session.id);

  if (error) return NextResponse.json([], { status: 500 });

  const formatted = data.map((item) => ({
    id: item.id,
    nft_id: item.nft_id,
    product_name: item.batch_nfts.product_name,
    description: item.batch_nfts.product_description,
    image_url: item.batch_nfts.nft_image_url,
    quantity: item.quantity,
  }));

  return NextResponse.json(formatted);
}
