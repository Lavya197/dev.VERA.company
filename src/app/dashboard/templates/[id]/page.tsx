"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Template {
  id: string;
  product_name: string;
  description: string;
  image_url: string;
}

export default function TemplateDetailPage() {
  const params = useParams();
  const { id } = params;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      const res = await fetch(`/api/templates/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data);
      } else {
        const err = await res.json();
        setError(err.message || "Unable to fetch template");
      }
      setLoading(false);
    }
    if (id) fetchTemplate();
  }, [id]);

  async function handleAddToCart() {
    setCartMessage(null);
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nft_id: id }),
    });

    const data = await res.json();
    if (res.ok) {
      setCartMessage("Added to cart ✅");
    } else {
      setCartMessage(data.message || "Failed to add to cart");
    }
  }

  if (loading) return <p className="p-6">Loading template...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!template) return <p className="p-6">Template not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <img
          src={template.image_url}
          alt={template.product_name}
          className="h-72 w-full object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{template.product_name}</h1>
          <p className="text-gray-700 mb-4">{template.description}</p>

          {/* Add to Cart form */}
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>

          {cartMessage && (
            <p className="mt-3 text-sm text-green-700">{cartMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
