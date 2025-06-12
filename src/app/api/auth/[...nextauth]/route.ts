/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

interface UserType {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  image: string;
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET_KEY as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user: UserType | null = await User.findOne({
            email: credentials?.email,
          });
          if (!user) {
            throw new Error("Invalid email or password");
          }
          if (!user.password) {
            throw new Error(
              "Account uses social login, please use GitHub or Google"
            );
          }
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user?.image,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        await connectToDatabase();
        const email = profile?.email;
        if (!email || !profile?.name) {
          console.error("Missing email or name in profile:", profile);
          return false;
        }
        const adminEmails = ["thainguyen4646@gmail.com"];
        const role = adminEmails.includes(email) ? "admin" : "user";
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile?.name,
            email,
            image: profile?.image,
            role,
          });
        } else if (!user.role) {
          await User.updateOne({ email }, { $set: { role } });
        }
        return true; // Chỉ trả về true
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Gán dữ liệu từ user (chỉ có khi đăng nhập lần đầu qua Credentials)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
      }
      // Với GitHub/Google, truy vấn CSDL để lấy role
      if (account?.provider === "github" || account?.provider === "google") {
        await connectToDatabase();
        const dbUser: UserType | null = await User.findOne({
          email: token.email,
        });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.name = dbUser.name || token.name;
          token.picture = dbUser.image || profile?.image || profile?.picture;
        } else {
          console.error("User not found in database:", token.email);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string | undefined,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
