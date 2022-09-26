const dummyData = [
    {id: 1, email: "omar_user", password:"omar_pass"},
    {id: 2, email: "linus_user", password: "linus_pass"},
    {id: 3, email: "alan_user", password: "alan_pass"}
]

const router = require('express').Router();
const {tokenBucketLimiter} = require('../middlewares/rate-limiters.js');
const redis = require("redis")

const client = redis.createClient();
client.on('error', (err) => console.log('Redis client error', err));
client.connect().then(() => console.log("Connected to Redis"));

router.post('/login', tokenBucketLimiter(client, 2, 150, "loginAttempt") , async (req, res, next) => {
    if (!req.body.email || !req.body.password){
        res.status(400).json({success:false, msg:"email or password is missing"});
    }

    const credentials = dummyData.find(element => element.email === req.body.email);
    if (!credentials || credentials.password !== req.body.password){
        res.status(404).json({success: false, msg: "email or password is incorrect"});
    }

    res.status(200).json({success: true});
});

module.exports = router;