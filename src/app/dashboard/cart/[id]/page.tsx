"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ FIX: Import Link
import { supabase } from "@/lib/supabase";

interface CartItemDetailPageProps {
  params: { id: string };
}

export default function CartItemDetailPage({ params }: CartItemDetailPageProps) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [cartItem, setCartItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. fetch session from API
        const res = await fetch("/api/session");
        const sessionData = await res.json();

        if (!sessionData?.isLoggedIn) {
          router.push("/login");
          return;
        }

        setSession(sessionData);

        // 2. fetch cart item
        const { data, error } = await supabase
          .from("carts")
          .select(
            `
            id,
            quantity,
            company_id,
            nft:batch_nfts (
              id,
              product_name,
              product_description,
              nft_image_url
            )
          `
          )
          .eq("id", params.id)
          .single();

        if (error || !data) {
          router.replace("/404"); // notFound equivalent for client
          return;
        }

        // 3. security: restrict access to same company
        if (data.company_id !== sessionData.id) {
          router.replace("/404");
          return;
        }

        setCartItem(data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  if (loading) return <p className="p-4">Loading...</p>;

  if (!cartItem) return null; // already redirected if invalid

  const nft = cartItem.nft;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border">
        <img
          src={nft.nft_image_url}
          alt={nft.product_name}
          className="h-64 w-full object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{nft.product_name}</h1>
          <p className="text-gray-700 mb-4">{nft.product_description}</p>

          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p className="text-lg font-semibold">Quantity: {cartItem.quantity}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={`/dashboard/cart/${cartItem.id}/payment`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continue to Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
