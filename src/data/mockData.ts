
export interface Shop {
    id: string;
    name: string;
    isVerified: boolean;
    trustScore: number;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    condition: 'New' | 'Used';
    rawText?: string;
    shop: Shop;
    imageUrl: string;
    postedAt: string;
    specs: {
        ram?: string;
        storage?: string;
        processor?: string;
        generation?: string;
    };
}

export const mockProducts: Product[] = [
    {
        id: '1',
        title: 'HP Omen 16 Gaming Laptop',
        price: 65000,
        condition: 'Used',
        shop: {
            id: 's1',
            name: 'Kebede Electronics',
            isVerified: true,
            trustScore: 450,
        },
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
        postedAt: '2 hours ago',
        specs: {
            ram: '16GB',
            storage: '512GB SSD',
            processor: 'Core i7 11th Gen'
        }
    },
    {
        id: '2',
        title: 'MacBook Pro M1 2020',
        price: 85000,
        condition: 'New',
        shop: {
            id: 's2',
            name: 'Apple Addis',
            isVerified: true,
            trustScore: 1200,
        },
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
        postedAt: '4 hours ago',
        specs: {
            ram: '8GB',
            storage: '256GB SSD',
            processor: 'M1'
        }
    },
    {
        id: '3',
        title: 'Dell XPS 13 9310',
        price: 72000,
        condition: 'Used',
        shop: {
            id: 's1',
            name: 'Kebede Electronics',
            isVerified: true,
            trustScore: 450,
        },
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80',
        postedAt: '1 day ago',
        specs: {
            ram: '16GB',
            storage: '1TB SSD',
            processor: 'Core i7'
        }
    },
    {
        id: '4',
        title: 'Samsung Galaxy S23 Ultra',
        price: 95000,
        condition: 'New',
        shop: {
            id: 's3',
            name: 'Mobile Zone',
            isVerified: false,
            trustScore: 50,
        },
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        postedAt: '30 mins ago',
        specs: {
            ram: '12GB',
            storage: '256GB'
        }
    }
];
