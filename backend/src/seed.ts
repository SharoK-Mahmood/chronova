import { env } from "./env.js";
import { SEED_PRODUCTS } from "./data/catalog.js";
import { hashPassword } from "./lib/passwords.js";
import { prisma } from "./lib/prisma.js";

async function seed() {
  const passwordHash = await hashPassword(env.adminPassword);

  await prisma.user.upsert({
    where: { email: env.adminEmail.toLowerCase() },
    update: {
      passwordHash,
      firstName: env.adminFirstName,
      lastName: env.adminLastName,
      role: "admin",
    },
    create: {
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      firstName: env.adminFirstName,
      lastName: env.adminLastName,
      role: "admin",
    },
  });

  for (const product of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        category: product.category,
        inStock: product.inStock,
        brand: product.brand,
        reference: product.reference ?? null,
        subtitle: product.subtitle ?? null,
      },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        category: product.category,
        inStock: product.inStock,
        brand: product.brand,
        reference: product.reference ?? null,
        subtitle: product.subtitle ?? null,
      },
    });
  }

  console.log(`Seeded admin ${env.adminEmail} and ${SEED_PRODUCTS.length} products.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
