import rateLimit from "express-rate-limit";

const fifteenMinutesInMs = 1 * 60 * 1000;

export const limiter = rateLimit({
  windowMs: fifteenMinutesInMs, // 15 minutes
  max: 2000, // limit each IP to 2000 requests per windowMs
  message: "Too many requests. Please try again later.", // message to send
  statusCode: 429, // status code to send
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,  // Disable the X-RateLimit-* headers
});