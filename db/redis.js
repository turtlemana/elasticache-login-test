import * as Redis from 'redis'

// docker exec -it redis_boot redis-cli -p 6379

const redis=Redis.createClient()

export default redis