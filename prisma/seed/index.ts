import { prisma } from "./client"
import seedLLMs from "./llms"
import seedMeta from "./meta"
import seedUsers from "./users"

try {
  await seedUsers()
  await seedLLMs()
  await seedMeta()
} catch (error) {
  console.error(error)
} finally {
  await prisma.$disconnect()
}
