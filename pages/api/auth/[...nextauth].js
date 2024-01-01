import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        id: "domain-login",
        name: "Domain Account",
        async authorize(credentials, req) {
          const user = {
            /* add function to get user */
          }
          return user
        },
        credentials: {
          domain: {
            label: "Domain",
            type: "text ",
            placeholder: "CORPNET",
            value: "CORPNET",
          },
          username: { label: "Username", type: "text ", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
      }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)