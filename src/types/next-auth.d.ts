import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Add role to User type
  }

  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string; // Add role to Session.user
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    role?: string; // Add role to JWT
  }
}
