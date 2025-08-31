import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { nft_id } = await req.json();
  if (!nft_id) {
    return NextResponse.json({ message: "NFT id required" }, { status: 400 });
  }

  // Check if already in cart
  const { data: existing } = await supabase
    .from("cart")
    .select("id")
    .eq("company_id", session.id)
    .eq("nft_id", nft_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ message: "Already in cart" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("carts")
    .insert([{ company_id: session.id, nft_id, quantity: 1 }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
