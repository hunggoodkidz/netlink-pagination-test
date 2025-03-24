// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('Seeding 100,000 users...');
  const usersData = [];
  for (let i = 1; i <= 100000; i++) {
    usersData.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    });
  }
  // Use createMany for efficiency; skipDuplicates in case of re-run.
  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });
  console.log('Users seeded.');
}

async function seedProducts() {
  console.log('Seeding 100 products...');
  const productsData = [];
  const numProducts = 100;
  for (let i = 1; i <= numProducts; i++) {
    productsData.push({
      product_name: `Product ${i}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      stock: Math.floor(Math.random() * 100),
    });
  }
  await prisma.product.createMany({
    data: productsData,
    skipDuplicates: true,
  });
  console.log('Products seeded.');
}

async function seedOrders() {
  console.log('Fetching products for order seeding...');
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    throw new Error('No products found. Ensure products are seeded before orders.');
  }

  console.log('Seeding 10,000 orders...');
  const ordersCount = 10000;

  for (let i = 1; i <= ordersCount; i++) {
    // Pick a random user (user IDs are between 1 and 100,000)
    const user_id = Math.floor(Math.random() * 100000) + 1;

    // Randomly decide how many products to add (between 1 and 3)
    const numOrderProducts = Math.floor(Math.random() * 3) + 1;
    const orderProducts = [];
    let totalAmount = 0;

    for (let j = 0; j < numOrderProducts; j++) {
      // Pick a random product from the seeded products
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 units
      const price = product.price; // use product price
      totalAmount += price.toNumber() * quantity;

      orderProducts.push({
        product_id: product.product_id,
        quantity,
        price,
      });
    }

    await prisma.order.create({
      data: {
        user_id,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        orderProducts: {
          create: orderProducts,
        },
      },
    });

    if (i % 1000 === 0) {
      console.log(`Seeded ${i} orders`);
    }
  }
  console.log('Orders seeded.');
}

async function main() {
  try {
    await seedUsers();
    await seedProducts();
    await seedOrders();
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
