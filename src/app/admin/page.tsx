
import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// This is a server action to verify a shop
async function verifyShop(formData: FormData) {
    'use server';
    const shopId = formData.get('shopId') as string;
    if (!shopId) return;

    await prisma.shop.update({
        where: { id: shopId },
        data: { isVerified: true },
    });

    revalidatePath('/admin');
}

export default async function AdminPage() {
    const unverifiedShops = await prisma.shop.findMany({
        where: { isVerified: false },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Verifications</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Shops waiting for approval.</p>
                </div>
                <div className="border-t border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                        {unverifiedShops.length === 0 ? (
                            <li className="px-4 py-4 sm:px-6 text-gray-500">No pending verifications.</li>
                        ) : (
                            unverifiedShops.map((shop) => (
                                <li key={shop.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-blue-600 truncate">{shop.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {shop.phoneNumber} • Chat ID: {shop.telegramChatId.toString()}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Loc: {shop.locationLat}, {shop.locationLong}
                                        </div>
                                    </div>
                                    <div>
                                        <form action={verifyShop}>
                                            <input type="hidden" name="shopId" value={shop.id} />
                                            <button
                                                type="submit"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Verify
                                            </button>
                                        </form>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
