import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  const options = [
    { name: "Create NFT Template", href: "/dashboard/create-nft" },
    { name: "Cart", href: "/dashboard/cart" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Created NFT Templates", href: "/dashboard/templates" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Welcome {session.email} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((opt) => (
          <a
            key={opt.name}
            href={opt.href}
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition text-center border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {opt.name}
            </h2>
          </a>
        ))}
      </div>
    </div>
  );
}
