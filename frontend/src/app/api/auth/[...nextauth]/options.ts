import { CHECK_CREDENTIALS_URL } from "@/lib/apiEndpoint"
import  { AuthOptions, ISODateString } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialProvider from "next-auth/providers/credentials"
import axios from "axios"

export type CustomSession = {
    user?: CustomUser
    expires:ISODateString
}

export type CustomUser = {
    id?:string | null
    name?:string | null
    email?:string | null
    token?:string | null
}

export const authOptions:AuthOptions = {
    
    pages: {
        signIn:"/login",
    },
    callbacks: {

      async session({ session,  token,user }: {session:CustomSession, token:JWT,user:CustomUser}) {
        session.user = token.user as CustomUser
        return session
      },
      async jwt({ token, user }: {token:JWT,user:CustomUser | null}) {
        if(user) {
          token.user = user
        }
        return token
      }
    },

    providers: [
      CredentialProvider({
          name:"Credentials",
          credentials: {
              email: { },
              password: { }
            },
            async authorize(credentials, req) {
              
              const {data} = await axios.post(CHECK_CREDENTIALS_URL,credentials);
              const user = data?.data
        
              if (user) {
                
                return user
              } else {
                
                return null
        
                
              }
            }
      }),
      
    ],
    secret: process.env.NEXTAUTH_SECRET,
}