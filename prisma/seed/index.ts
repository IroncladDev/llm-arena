import seedChangeRequests from "./changes"
import { prisma } from "./client"
import seedLLMs from "./llms"
import seedMeta from "./meta"
import seedUsers from "./users"

try {
  await seedUsers()
  await seedLLMs()
  await seedMeta()
  await seedChangeRequests()
} catch (error) {
  console.error(error)
} finally {
  await prisma.$disconnect()
}
