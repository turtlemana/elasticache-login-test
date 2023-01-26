// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from "../../../db/redis";


export default async function handler(req, res) {
    // const redis = new Redis(process.env.REDIS_URL); 
    // const redis=createRedisInstance();
    redis.connect()
    if(req.method!=="POST"){res.status(405).json({body:"Method not Allowed"}); return;}
    if(!req.body) return res.status(404).json({error:"Don't have login data"})
    const {newUser}=req.body; 
    const checkExisting=redis.hExists("users",newUser.email)
    if(checkExisting===1) return res.status(422).json({message:"User already exists"})

    const newUserObj={
        ...newUser,
        created_at:Date.now()
    }

    await redis.hSet("users",newUser.email,JSON.stringify(newUserObj))
    await redis.disconnect()
    
    res.status(200).json({ newUser: newUserObj })
  }
  