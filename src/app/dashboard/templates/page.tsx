"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Template {
  id: string;
  product_name: string;
  description: string;
  image_url: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const res = await fetch("/api/templates/list");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  if (loading) return <p className="p-6">Loading templates...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Created NFT Templates</h1>

      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border"
            >
              <img
                src={tpl.image_url}
                alt={tpl.product_name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{tpl.product_name}</h2>
                <p className="text-gray-600 line-clamp-2">{tpl.description}</p>
                <Link
                  href={`/dashboard/templates/${tpl.id}`}
                  className="mt-3 inline-block text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
