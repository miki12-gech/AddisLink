
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const shop1 = await prisma.shop.create({
        data: {
            name: 'Kebede Electronics',
            telegramChatId: BigInt(123456789),
            phoneNumber: '+251911234567',
            locationLat: 9.0300,
            locationLong: 38.7400,
            isVerified: true,
            trustScore: 450,
            products: {
                create: [
                    {
                        rawText: 'HP Omen 16 Gaming Laptop 16GB RAM 512GB SSD',
                        price: 65000,
                        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
                        parsedSpecs: {
                            ram: '16GB',
                            storage: '512GB SSD',
                            processor: 'Core i7 11th Gen'
                        }
                    },
                    {
                        rawText: 'Dell XPS 13 9310 16GB 1TB',
                        price: 72000,
                        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80',
                        parsedSpecs: {
                            ram: '16GB',
                            storage: '1TB SSD',
                            processor: 'Core i7'
                        }
                    }
                ]
            }
        },
    });

    const shop2 = await prisma.shop.create({
        data: {
            name: 'Apple Addis',
            telegramChatId: BigInt(987654321),
            phoneNumber: '+251922334455',
            locationLat: 9.0200,
            locationLong: 38.7500,
            isVerified: true,
            trustScore: 1200,
            products: {
                create: [
                    {
                        rawText: 'MacBook Pro M1 2020 8GB 256GB',
                        price: 85000,
                        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
                        parsedSpecs: {
                            ram: '8GB',
                            storage: '256GB SSD',
                            processor: 'M1'
                        }
                    }
                ]
            }
        },
    });

    console.log({ shop1, shop2 });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
