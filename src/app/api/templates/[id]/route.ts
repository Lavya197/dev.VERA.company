import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("batch_nfts")
    .select("id, product_name, product_description, nft_image_url, company_id")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Template not found" }, { status: 404 });
  }

  // Security check → only allow owner company
  if (data.company_id !== session.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: data.id,
    product_name: data.product_name,
    description: data.product_description,
    image_url: data.nft_image_url,
  });
}
