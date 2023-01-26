const fetcher=async()=>{
    const res=await fetch(`http://localhost:3000/api/auth/getUser`)
    // if(res.ok===false){const error= new Error("An error occurred while fetching the data")
    // error.info=await res.json()
    // error.status=res.status
    // throw error }

    const data=await res.json()
    // console.log("userInfo",JSON.parse(userInfo.user))
    const userInfo=data.user
    return userInfo
}

export default fetcher