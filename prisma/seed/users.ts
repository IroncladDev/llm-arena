import { UserRole } from "@prisma/client";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { prisma } from "./client";
import inquirer from "inquirer";

export default async function seedUsers() {
  const generateHandle = () =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "",
      style: "capital",
    });

  const { handle, email } = await inquirer.prompt([
    {
      type: "input",
      name: "handle",
      message: "Enter your github handle to create the root user",
    },
    {
      type: "input",
      name: "email",
      message: "Enter your github email to create the root user",
    },
  ]);

  await prisma.user.upsert({
    where: { handle, email },
    update: {
      handle,
      provider: "github",
      email,
      role: UserRole.admin,
    },
    create: {
      handle,
      provider: "github",
      email,
      role: UserRole.admin,
    },
  });

  // Create 20 users with the role "user"
  await prisma.user.createMany({
    data: [...Array(20)].map(generateHandle).map(() => ({
      handle: generateHandle(),
      provider: "github",
      email: `${generateHandle()}@example.com`,
      role: UserRole.user,
    })),
    skipDuplicates: true,
  });

  // Create 20 users with the role "pending"
  await prisma.user.createMany({
    data: [...Array(20)].map(generateHandle).map(() => ({
      handle: generateHandle(),
      provider: "github",
      email: `${generateHandle()}@example.com`,
      role: UserRole.pending,
    })),
    skipDuplicates: true,
  });

  // Create 20 users with the role "contributor"
  await prisma.user.createMany({
    data: [...Array(20)].map(generateHandle).map(() => ({
      handle: generateHandle(),
      provider: "github",
      email: `${generateHandle()}@example.com`,
      role: UserRole.contributor,
    })),
    skipDuplicates: true,
  });
}
