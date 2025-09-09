import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    maxAge: 60*60*24,
    updateAge: 60*60*24
  },
  // callbacks: {
  //   async signIn({user,account,credentials,email,profile}){
  //     console.log({user,account,credentials,email,profile});
  //   },
  //       async signOut({user,account,credentials,email,profile}){
  //     console.log("signin out");
  //   }
  // }

})
