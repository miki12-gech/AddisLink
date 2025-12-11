
import { z } from 'zod';

export const searchSchema = z.object({
    q: z.string().max(100).optional(),
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
});

export const productSchema = z.object({
    rawText: z.string().min(10).max(1000),
    price: z.number().positive(),
    imageUrl: z.string().url(),
    shopId: z.string().uuid(),
});

export const shopSchema = z.object({
    name: z.string().min(2).max(50),
    phoneNumber: z.string().min(9).max(15),
    locationLat: z.number(),
    locationLong: z.number(),
});
