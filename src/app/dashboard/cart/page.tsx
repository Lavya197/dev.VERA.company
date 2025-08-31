"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const [session, setSession] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch session from API
        const res = await fetch("/api/session");
        const data = await res.json();
        setSession(data);

        if (data?.isLoggedIn) {
          const { data: items } = await supabase
            .from("carts")
            .select(
              `
              id,
              quantity,
              nft_id,
              batch_nfts (
                id,
                product_name,
                product_description,
                nft_image_url
              )
            `
            )
            .eq("company_id", data.id);

          setCartItems(items ?? []);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  if (!session?.isLoggedIn) {
    return <p className="p-4">Please log in to view your cart.</p>;
  }

  if (cartItems.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow-md p-4 bg-white"
          >
            <img
              src={item.batch_nfts.nft_image_url}
              alt={item.batch_nfts.product_name}
              className="h-40 w-full object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-2">
              {item.batch_nfts.product_name}
            </h2>
            <p className="text-gray-600">
              {item.batch_nfts.product_description}
            </p>
            <p className="mt-2 font-medium">Quantity: {item.quantity}</p>

            <Link
              href={`/dashboard/cart/${item.id}`}
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
