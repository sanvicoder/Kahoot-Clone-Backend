// src/types/express.d.ts
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // You can replace 'any' with a better type later
  }
}
