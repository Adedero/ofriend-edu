import type { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible"; //use a store in production


const options = {
  points: 8,
  duration: 1
};

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.ip) {
      await new RateLimiterMemory(options).consume(req.ip);
    }
    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    res.status(429).send('Too Many Requests');
  }
}

export default rateLimiter;



/* 
const rateLimiterMiddleware = (req, res, next) => {
   rateLimiterRedis.consume(req.ip)
      .then(() => {
          next();
      })
      .catch(_ => {
          res.status(429).send('Too Many Requests');
      });
   };


rateLimiter.consume(remoteAddress, 2) // consume 2 points
    .then((rateLimiterRes) => {
      // 2 points consumed
    })
    .catch((rateLimiterRes) => {
      // Not enough points to consume
    });
RateLimiterRes object
The Promise's resolve and reject callbacks both return an instance of the RateLimiterRes class if there is no error. Object attributes:

RateLimiterRes = {
    msBeforeNext: 250, // Number of milliseconds before next action can be done
    remainingPoints: 0, // Number of remaining points in current duration 
    consumedPoints: 5, // Number of consumed points in current duration 
    isFirstInDuration: false, // action is first in current duration 
}
You may want to set HTTP headers for the response:

const headers = {
  "Retry-After": rateLimiterRes.msBeforeNext / 1000,
  "X-RateLimit-Limit": opts.points,
  "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
  "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
} */