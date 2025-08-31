import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const productName = formData.get("product_name") as string;
  const description = formData.get("product_description") as string;
  const image = formData.get("image") as File;

  if (!productName || !description || !image) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // 🚫❌ Don't delete old templates or images here

  // ✅ Upload new image
  const fileName = `${Date.now()}-${image.name}`;
  const { error: uploadError } = await supabase.storage
    .from("nft-images")
    .upload(fileName, image);

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  // ✅ Get public URL
  const { data: urlData } = supabase.storage
    .from("nft-images")
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;

  // ✅ Insert new NFT template (without wiping old ones)
  const { error: insertError } = await supabase.from("batch_nfts").insert([
    {
      product_name: productName,
      product_description: description,
      nft_image_url: imageUrl,
      nft_status: "draft",
      nft_uri: null,
      company_id: session.id, // company ID from session
    },
  ]);

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "NFT Template created successfully" });
}
