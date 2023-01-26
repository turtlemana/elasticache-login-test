// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import redis from "../../../db/redis";

import {getToken} from "next-auth/jwt"
import { authOptions } from './[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"



export default async function handler(req, res) {
  // const redis=createRedisInstance();
  redis.connect()
// const redis = new Redis(process.env.REDIS_URL); 
    if(req.method!=="GET"){res.status(405).json({body:"Method not Allowed"}); return;}
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
    const userRes=await redis.hGet("users",session?.user?.email)
    // await redis.quit()
    await redis.disconnect()
    const user=await JSON.parse(userRes)
    

    // const user=userRes.map((info)=>JSON.parse(info))
    // if(redis.hget('users',user.email)){return}
    // const secret=process.env.NEXTAUTH_SECRET 
    // const token=await getToken({req,secret})
    // console.log(token)
    // const usersArr=await redis.hvals("users")
    // const users=usersArr.map((user)=>JSON.parse(user))
    res.status(200).json({user})
  }
  