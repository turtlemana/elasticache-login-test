import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from 'next-auth/providers/kakao'
import FacebookProvider from 'next-auth/providers/facebook'
import NaverProvider from 'next-auth/providers/naver'
import {v4 as uuid} from 'uuid';
import redis from "../../../db/redis"



// import redis from "../../../redis";

export const authOptions = {
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret:process.env.NEXTAUTH_SECRET,
  pages:{
    signIn:'/auth/signin',
    error:'/auth/signin'
  },
  session:{
    strategy:'jwt'
  },

  callbacks:{



    async signIn({user,account,profile,credentials}){

    //   redis.connect()
      console.log("user",user)
      console.log ("account",account)
      console.log('profile', profile)

        

        const isUserExist=await redis.HEXISTS("users",user?.email)
        // await redis.quit()
          
        
        const id=uuid();
        console.log(isUserExist)
        // await redis.disconnect()
        if(!isUserExist){
        //   await redis.disconnect()

          const newUser={id,email:user?.email, platform_type:account?.provider, name:user?.name, profileImage:user?.image,created_at:Date.now(),accessLevel:1}
      
          console.log(newUser)
      
          const data = await fetch('http://localhost:3000/api/auth/addUser',{
              method:"POST",
              headers:{
                  "content-type":"application/json"
              },
              body:JSON.stringify({newUser})
          }).then(res=>res.json())
  
          console.log("success?")

  
          return [data.newUser] 

        }  else if (isUserExist){
          const userInfo=await redis.hGet("users",user?.email)
          await redis.disconnect()
          const parsedInfo=await JSON.parse(userInfo)
          const userPlatform=parsedInfo.platform_type
     
          // await redis.quit()
          if(userPlatform !== account?.provider){
            // alert(`Your email has logged in from `)
            return false
        
          } else {
            return true
          }

     
      }

    },

  }



}
export default NextAuth(authOptions)