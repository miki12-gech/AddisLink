
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (query) {
        filters.OR = [
            { rawText: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.gte = parseFloat(minPrice);
        if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    try {
        const products = await prisma.product.findMany({
            where: filters,
            include: {
                shop: {
                    select: {
                        name: true,
                        isVerified: true,
                        trustScore: true,
                        locationLat: true,
                        locationLong: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.product.count({ where: filters });

        return NextResponse.json({
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}
