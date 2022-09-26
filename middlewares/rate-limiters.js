const {TooManyRequestsError} = require("../errors");
const tokenBucketLimiter = async (redis, bucketCapacity, refillInterval, key) => {
        let currentTimestamp = new Date().getTime();
        const currentTimestampToString = currentTimestamp.toString();
        let intervalDifference = currentTimestamp - (1000 * refillInterval);
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
            throw new TooManyRequestsError('Too many requests');
        }
}

module.exports = {
    tokenBucketLimiter
}
