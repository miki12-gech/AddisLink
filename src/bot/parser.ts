
export interface ParsedProduct {
    price: number;
    specs: {
        ram?: string;
        storage?: string;
        processor?: string;
        generation?: string;
        graphics?: string;
        display?: string;
        battery?: string;
        condition?: string;
    };
}

export function parseTelegramText(text: string): ParsedProduct {
    const lowerText = text.toLowerCase();

    // 1. Extract Price (Robust)
    // Matches: 50000 br, 50,000 birr, 50000 (if big number)
    let price = 0;
    const priceRegex = /(\d{1,3}(?:,\d{3})*|\d+)\s*(?:br|birr|etb)/i;
    const priceMatch = lowerText.match(priceRegex);

    if (priceMatch) {
        price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    } else {
        // Fallback: Largest number > 1000
        const numbers = lowerText.match(/\d+/g);
        if (numbers) {
            const distinctNumbers = numbers.map(n => parseInt(n, 10)).filter(n => n > 1000);
            if (distinctNumbers.length > 0) price = Math.max(...distinctNumbers);
        }
    }

    // 2. Extract RAM
    const ramMatch = lowerText.match(/(\d+\s?gb)\s*(?:ram|memory)?/i);
    const ram = ramMatch ? ramMatch[1].toUpperCase().replace(/\s/g, '') : undefined;

    // 3. Extract Storage
    let storage = undefined;
    // SSD/HDD explicit
    const storageRegex = /(\d+\s?(?:gb|tb))\s*(?:ssd|hdd|storage)/i;
    const directStorageMatch = lowerText.match(storageRegex);
    if (directStorageMatch) {
        storage = directStorageMatch[1].toUpperCase().replace(/\s/g, '');
        if (lowerText.includes('ssd')) storage += ' SSD';
        else if (lowerText.includes('hdd')) storage += ' HDD';
    } else {
        // Heuristic: > 32GB is likely storage if not already captured as RAM
        const allGbMatches = [...lowerText.matchAll(/(\d+)\s?gb/gi)];
        for (const match of allGbMatches) {
            const val = parseInt(match[1], 10);
            // If it's not the same val as detected RAM (roughly)
            if (val > 32) {
                storage = `${val}GB`;
                break;
            }
        }
        // TB check
        const tbMatch = lowerText.match(/(\d+\s?tb)/i);
        if (tbMatch) storage = tbMatch[1].toUpperCase().replace(/\s/g, '');
    }

    // 4. Processor (Enhanced)
    let processor = undefined;
    if (lowerText.includes('i7')) processor = 'Core i7';
    else if (lowerText.includes('i5')) processor = 'Core i5';
    else if (lowerText.includes('i3')) processor = 'Core i3';
    else if (lowerText.includes('i9')) processor = 'Core i9';
    else if (lowerText.includes('ryzen 3')) processor = 'Ryzen 3';
    else if (lowerText.includes('ryzen 5')) processor = 'Ryzen 5';
    else if (lowerText.includes('ryzen 7')) processor = 'Ryzen 7';
    else if (lowerText.includes('ryzen 9')) processor = 'Ryzen 9';
    else if (lowerText.includes('m1')) processor = 'Apple M1';
    else if (lowerText.includes('m2')) processor = 'Apple M2';
    else if (lowerText.includes('m3')) processor = 'Apple M3';
    else if (lowerText.includes('celeron')) processor = 'Intel Celeron';

    // 5. Generation
    let generation = undefined;
    const genMatch = lowerText.match(/(\d{1,2})(?:th|nd|rd|st)\s?gen/i);
    if (genMatch) {
        generation = `${genMatch[1]}th Gen`;
    }

    // 6. Graphics
    let graphics = undefined;
    if (lowerText.includes('rtx')) {
        const rtxMatch = lowerText.match(/rtx\s?(\d{3,4})/i);
        graphics = rtxMatch ? `RTX ${rtxMatch[1]}` : 'NVIDIA RTX';
    } else if (lowerText.includes('gtx')) {
        const gtxMatch = lowerText.match(/gtx\s?(\d{3,4})/i);
        graphics = gtxMatch ? `GTX ${gtxMatch[1]}` : 'NVIDIA GTX';
    } else if (lowerText.includes('intel uhd') || lowerText.includes('intel hd')) {
        graphics = 'Intel UHD/HD';
    } else if (lowerText.includes('iris')) {
        graphics = 'Intel Iris';
    }

    // 7. Display
    let display = undefined;
    if (lowerText.includes('15.6')) display = '15.6"';
    else if (lowerText.includes('14 inch') || lowerText.includes('14"')) display = '14"';
    else if (lowerText.includes('13 inch') || lowerText.includes('13"')) display = '13"';
    else if (lowerText.includes('17 inch') || lowerText.includes('17.3')) display = '17.3"';

    if (lowerText.includes('4k')) display = (display || '') + ' 4K';
    else if (lowerText.includes('fhd') || lowerText.includes('1080p')) display = (display || '') + ' FHD';
    else if (lowerText.includes('touch')) display = (display || '') + ' Touch';

    display = display ? display.trim() : undefined;

    // 8. Battery
    let battery = undefined;
    const batteryMatch = lowerText.match(/(\d+\s?hr|\d+\s?hour)/i);
    if (batteryMatch) battery = batteryMatch[1];
    else if (lowerText.includes('good battery')) battery = 'Good';
    else if (lowerText.includes('double battery')) battery = 'Double';


    // 9. Condition
    let condition = 'Used';
    if (lowerText.includes('new') || lowerText.includes('sealed') || lowerText.match(/brand\s?new/i)) {
        condition = 'New';
    } else if (lowerText.includes('open box')) {
        condition = 'Open Box';
    }

    return {
        price,
        specs: {
            ram,
            storage,
            processor,
            generation,
            graphics,
            display,
            battery,
            condition
        }
    };
}
