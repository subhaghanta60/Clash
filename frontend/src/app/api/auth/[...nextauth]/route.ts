import NextAuth from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { authOptions } from "./options"



const handler = NextAuth(authOptions)
export {handler as POST, handler as GET};