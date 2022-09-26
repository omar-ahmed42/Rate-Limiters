const tokenBucketLimiter = (redis, bucketCapacity, refillInterval, key) => {
    return async (req, res, next) => {
        let currentTimestamp = new Date().getTime();
        const currentTimestampToString = currentTimestamp.toString();
        let intervalDifference = currentTimestamp - (1000 * refillInterval);
        console.log("key: " + key);
        const [removeByRange, range] = await redis
            .multi()
            .zRemRangeByScore(key, 0, intervalDifference)
            .zRange(key, 0, -1)
            .zAdd(key,
                {
                    score: currentTimestampToString,
                    value: currentTimestampToString
                })
            .expireAt(key, currentTimestamp + (refillInterval * 1000))
            .exec();

        if (range.length >= bucketCapacity) {
            return res.status(429).json({success: false, msg: "Too many requests"});
        }
        next();
    }
}

module.exports = {
    tokenBucketLimiter
}

