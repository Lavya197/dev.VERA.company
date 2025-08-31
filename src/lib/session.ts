import { IronSessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "manufacturing-dashboard-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export type UserSession = {
  id?: string;
  email?: string;
  role?: string;  // "company"
  isLoggedIn?: boolean;
};


export async function getSession() {
  const session = await getIronSession<UserSession>(
    cookies(),
    sessionOptions
  );
  return session;
}
