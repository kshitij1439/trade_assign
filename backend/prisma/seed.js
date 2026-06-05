"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Clearing existing data...');
    await prisma.rating.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();
    console.log('Creating users...');
    // Password for all demo users: Test@1234
    const hashedPassword = await bcryptjs_1.default.hash('Test@1234', 10);
    // --- ADMIN ---
    const admin = await prisma.user.create({
        data: {
            name: 'System Administrator User',
            email: 'admin@ratemystore.com',
            password: hashedPassword,
            address: '101 Admin Tower, Tech Park, Pune, Maharashtra 411001',
            role: 'ADMIN',
        },
    });
    console.log(`  Admin: ${admin.email}`);
    // --- STORE OWNERS ---
    const owner1 = await prisma.user.create({
        data: {
            name: 'Rajesh Kumar Sharma Owner',
            email: 'rajesh@electronics.com',
            password: hashedPassword,
            address: '45 MG Road, Camp Area, Pune, Maharashtra 411001',
            role: 'STORE_OWNER',
        },
    });
    const owner2 = await prisma.user.create({
        data: {
            name: 'Priya Deshmukh Store Owner',
            email: 'priya@fashionhub.com',
            password: hashedPassword,
            address: '78 FC Road, Shivajinagar, Pune, Maharashtra 411005',
            role: 'STORE_OWNER',
        },
    });
    const owner3 = await prisma.user.create({
        data: {
            name: 'Amit Patel Store Owner Person',
            email: 'amit@freshmart.com',
            password: hashedPassword,
            address: '22 Aundh Road, Near Bremen Chowk, Pune, Maharashtra 411007',
            role: 'STORE_OWNER',
        },
    });
    console.log(`  Store Owners: ${owner1.email}, ${owner2.email}, ${owner3.email}`);
    // --- NORMAL USERS ---
    const user1 = await prisma.user.create({
        data: {
            name: 'Sneha Kulkarni Normal User',
            email: 'sneha@gmail.com',
            password: hashedPassword,
            address: '12 Koregaon Park, Lane 6, Pune, Maharashtra 411001',
            role: 'NORMAL_USER',
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: 'Vikram Singh Normal User',
            email: 'vikram@gmail.com',
            password: hashedPassword,
            address: '88 Baner Road, Sus Road Junction, Pune, Maharashtra 411045',
            role: 'NORMAL_USER',
        },
    });
    const user3 = await prisma.user.create({
        data: {
            name: 'Ananya Joshi Normal User',
            email: 'ananya@gmail.com',
            password: hashedPassword,
            address: '33 Viman Nagar, Near Phoenix Mall, Pune, Maharashtra 411014',
            role: 'NORMAL_USER',
        },
    });
    const user4 = await prisma.user.create({
        data: {
            name: 'Rohan Mehta Normal User Person',
            email: 'rohan@gmail.com',
            password: hashedPassword,
            address: '56 Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune 411057',
            role: 'NORMAL_USER',
        },
    });
    const user5 = await prisma.user.create({
        data: {
            name: 'Deepika Nair Normal User Person',
            email: 'deepika@gmail.com',
            password: hashedPassword,
            address: '9 Kothrud, Near Dahanukar Colony, Pune, Maharashtra 411038',
            role: 'NORMAL_USER',
        },
    });
    console.log(`  Normal Users: ${user1.email}, ${user2.email}, ${user3.email}, ${user4.email}, ${user5.email}`);
    // --- STORES ---
    console.log('Creating stores...');
    const store1 = await prisma.store.create({
        data: {
            name: 'Rajesh Electronics Megastore',
            email: 'contact@rajeshelectronics.com',
            address: '45 MG Road, Camp Area, Pune, Maharashtra 411001',
            ownerId: owner1.id,
        },
    });
    const store2 = await prisma.store.create({
        data: {
            name: 'Priya Fashion Hub Boutique',
            email: 'info@priyafashionhub.com',
            address: '78 FC Road, Shivajinagar, Pune, Maharashtra 411005',
            ownerId: owner2.id,
        },
    });
    const store3 = await prisma.store.create({
        data: {
            name: 'FreshMart Grocery Superstore',
            email: 'support@freshmart.com',
            address: '22 Aundh Road, Near Bremen Chowk, Pune, Maharashtra 411007',
            ownerId: owner3.id,
        },
    });
    console.log(`  Stores: ${store1.name}, ${store2.name}, ${store3.name}`);
    // --- RATINGS ---
    console.log('Creating ratings...');
    const ratingsData = [
        // Ratings for Rajesh Electronics
        { userId: user1.id, storeId: store1.id, value: 5 },
        { userId: user2.id, storeId: store1.id, value: 4 },
        { userId: user3.id, storeId: store1.id, value: 4 },
        { userId: user4.id, storeId: store1.id, value: 3 },
        { userId: user5.id, storeId: store1.id, value: 5 },
        // Ratings for Priya Fashion Hub
        { userId: user1.id, storeId: store2.id, value: 4 },
        { userId: user2.id, storeId: store2.id, value: 5 },
        { userId: user3.id, storeId: store2.id, value: 3 },
        { userId: user4.id, storeId: store2.id, value: 4 },
        // Ratings for FreshMart
        { userId: user1.id, storeId: store3.id, value: 3 },
        { userId: user3.id, storeId: store3.id, value: 2 },
        { userId: user5.id, storeId: store3.id, value: 4 },
    ];
    for (const r of ratingsData) {
        await prisma.rating.create({ data: r });
    }
    console.log(`  Created ${ratingsData.length} ratings`);
    // --- SUMMARY ---
    console.log('\n========================================');
    console.log('  SEED DATA CREATED SUCCESSFULLY');
    console.log('========================================');
    console.log('\nAll demo accounts use password: Test@1234');
    console.log('\nAdmin Login:');
    console.log('  Email: admin@ratemystore.com');
    console.log('\nStore Owner Logins:');
    console.log('  Email: rajesh@electronics.com');
    console.log('  Email: priya@fashionhub.com');
    console.log('  Email: amit@freshmart.com');
    console.log('\nNormal User Logins:');
    console.log('  Email: sneha@gmail.com');
    console.log('  Email: vikram@gmail.com');
    console.log('  Email: ananya@gmail.com');
    console.log('  Email: rohan@gmail.com');
    console.log('  Email: deepika@gmail.com');
    console.log('========================================\n');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
