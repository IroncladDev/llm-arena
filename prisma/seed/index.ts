import seedUsers from "./users";
import seedLLMs from "./llms";
import seedMeta from "./meta";
import { prisma } from "./client";

try {
  await seedUsers();
  await seedLLMs();
  await seedMeta();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
