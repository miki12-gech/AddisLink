
import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import { parseTelegramText } from './parser';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Configure Cloudinary
// It will automatically pick up CLOUDINARY_URL provided in env, 
// or search for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// We'll set these in .env

const registrationState = new Map<number, { step: number, name?: string, phone?: string }>();

bot.start(async (ctx) => {
    const chatId = ctx.from.id;
    const existingShop = await prisma.shop.findUnique({
        where: { telegramChatId: BigInt(chatId) }
    });

    if (existingShop) {
        ctx.reply(`Welcome Back, ${existingShop.name}! Post products by sending a photo with details.`);
    } else {
        ctx.reply("Welcome to AddisLink! Let's get your shop registered.\n\nWhat is your Shop Name?");
        registrationState.set(chatId, { step: 1 });
    }
});

bot.on('text', async (ctx) => {
    const chatId = ctx.from.id;
    const state = registrationState.get(chatId);
    const text = ctx.message.text;

    console.log(`[Bot] Received text from ${chatId}: ${text}`); // Debug log

    // Ignore commands (handled by other listeners)
    if (text.startsWith('/')) {
        console.log('[Bot] Ignoring command');
        return;
    }

    if (state) {
        console.log('[Bot] User is in registration state:', state.step);
        if (state.step === 1) {
            state.name = text;
            state.step = 2;
            ctx.reply(`Nice to meet you, ${text}. Now, please share your phone number.`);
            registrationState.set(chatId, state);
        } else if (state.step === 2) {
            state.phone = text;
            state.step = 3;
            ctx.reply(
                "Almost done! Please share your shop's GPS location via Telegram attachment.",
                Markup.keyboard([
                    Markup.button.locationRequest('📍 Share Location')
                ]).resize().oneTime()
            );
            registrationState.set(chatId, state);
        }
        return;
    }

    // Handle generic text from registered/unregistered users
    try {
        console.log('[Bot] Checking if shop exists for', chatId);
        const existingShop = await prisma.shop.findUnique({
            where: { telegramChatId: BigInt(chatId) }
        });

        console.log('[Bot] Shop exists:', !!existingShop);

        if (existingShop) {
            await ctx.reply(`Welcome Back, ${existingShop.name}! To post a product, simply send me a photo.`);
        } else {
            await ctx.reply("Please use /start to register your shop account.");
        }
    } catch (error) {
        console.error("[Bot] Error checking shop existence:", error);
        ctx.reply("❌ An error occurred while checking your account.");
    }
});

bot.on('location', async (ctx) => {
    const chatId = ctx.from.id;
    const state = registrationState.get(chatId);

    if (state && state.step === 3 && ctx.message.location) {
        const { latitude, longitude } = ctx.message.location;

        try {
            await prisma.shop.create({
                data: {
                    name: state.name!,
                    phoneNumber: state.phone!,
                    telegramChatId: BigInt(chatId),
                    locationLat: latitude,
                    locationLong: longitude,
                    isVerified: false
                }
            });

            registrationState.delete(chatId);
            ctx.reply("✅ Registration Complete! You can now post products by sending a photo with details.", Markup.removeKeyboard());
        } catch (e) {
            console.error(e);
            ctx.reply("Error creating shop. Please try again /start");
            registrationState.delete(chatId);
        }
    }
});

const mediaGroupBuffer = new Map<string, {
    fileIds: string[],
    caption?: string,
    chatId: number,
    timer: NodeJS.Timeout
}>();

bot.on('photo', async (ctx) => {
    const message = ctx.message;
    const chatId = ctx.from.id;
    const mediaGroupId = 'media_group_id' in message ? (message as any).media_group_id : null;

    // Get highest resolution photo
    const photo = message.photo[message.photo.length - 1];
    const fileId = photo.file_id;
    const caption = message.caption;

    if (!mediaGroupId) {
        // Single Photo Logic (Existing)
        await processSingleProduct(ctx, fileId, caption);
        return;
    }

    // Media Group Logic (Album)
    if (!mediaGroupBuffer.has(mediaGroupId)) {
        // First image in album
        mediaGroupBuffer.set(mediaGroupId, {
            fileIds: [fileId],
            caption: caption, // Caption usually comes with the first message or one of them
            chatId: chatId,
            timer: setTimeout(() => processAlbum(mediaGroupId, ctx), 2000) // Wait 2s for all photos
        });
    } else {
        // Subsequent images
        const group = mediaGroupBuffer.get(mediaGroupId)!;
        group.fileIds.push(fileId);
        if (caption && !group.caption) group.caption = caption; // Capture caption if it appeared later
        mediaGroupBuffer.set(mediaGroupId, group);
    }
});

async function processSingleProduct(ctx: any, fileId: string, caption?: string) {
    await createProduct(ctx, [fileId], caption);
}

async function processAlbum(mediaGroupId: string, ctx: any) {
    const group = mediaGroupBuffer.get(mediaGroupId);
    if (!group) return;

    mediaGroupBuffer.delete(mediaGroupId); // Cleanup
    await createProduct(ctx, group.fileIds, group.caption);
}

async function createProduct(ctx: any, fileIds: string[], caption?: string) {
    const chatId = ctx.from.id;
    const shop = await prisma.shop.findUnique({ where: { telegramChatId: BigInt(chatId) } });

    if (!shop) {
        ctx.reply("Use /start to register your shop first.");
        return;
    }

    if (!caption) {
        ctx.reply("Please add a caption with price and specs!");
        return;
    }

    // Parse Caption
    const parsed = parseTelegramText(caption);
    if (parsed.price === 0) {
        ctx.reply("⚠️ Note: I couldn't find a price. I'll save it as 'Call for Price'.");
    }

    ctx.reply(`⏳ Processing ${fileIds.length} image(s)...`);

    // Upload all images to Cloudinary in parallel
    const imageUrls: string[] = [];

    try {
        const uploadPromises = fileIds.map(async (fid) => {
            const link = await bot.telegram.getFileLink(fid);
            const result = await cloudinary.uploader.upload(link.href, { folder: "addislink_products" });
            return result.secure_url;
        });

        const results = await Promise.all(uploadPromises);
        imageUrls.push(...results);

    } catch (err) {
        console.error("Cloudinary upload failed", err);
        ctx.reply("⚠️ Some images failed to upload.");
        return;
    }

    // Save to DB
    try {
        await prisma.product.create({
            data: {
                shopId: shop.id,
                rawText: caption,
                price: parsed.price,
                imageUrl: imageUrls[0], // Main image
                images: imageUrls,      // Gallery
                parsedSpecs: parsed.specs as any,
            }
        });

        ctx.reply(`✅ Posted: ${parsed.specs.condition === 'New' ? '🆕' : ''} Item with ${imageUrls.length} photos.\nPrice: ${parsed.price} ETB\n\nView at: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`);
    } catch (e: any) {
        console.error("Save Error:", e);
        ctx.reply(`❌ Failed to save product. Error: ${e.message || e}`);
    }
}


console.log('Bot is running...');
bot.launch().catch(err => {
    console.error('Failed to launch bot', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Add HTTP Server for Render Health Check
import http from 'http';

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Health check server listening on port ${port}`);
});
