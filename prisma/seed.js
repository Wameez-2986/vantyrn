const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = "abid@gmail.com";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
  } else {
    const seedPassword = process.env.ADMIN_SEED_PASSWORD || "vantyrn@2026";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(seedPassword, salt);

    await prisma.adminUser.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
