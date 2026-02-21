import { createAuthClient } from "better-auth/react"
export const { signIn, signUp, signOut, useSession } = createAuthClient({
    baseURL: "https://hallucinate-ai.vercel.app"
})