import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getIronSession } from "iron-session";
import { sessionOptions, UserSession } from "@/lib/session";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // ✅ query companies table instead of admin_users
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("email", email)
    .eq("password", password) // no decryption needed
    .single();

  if (error || !company) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // create response & session
  const res = NextResponse.json({ message: "Login successful" });
  const session = await getIronSession<UserSession>(req, res, sessionOptions);

  session.id = company.id;       // assuming `id` column exists in companies
  session.email = company.email;
  session.role = "company";      // fixed role since these are companies
  session.isLoggedIn = true;

  await session.save();

  return res;
}
