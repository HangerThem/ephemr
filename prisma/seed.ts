import { PrismaClient } from "@prisma/client"
import { moods } from "./data"

const prisma = new PrismaClient()

async function main() {
	await prisma.mood.deleteMany()
	console.log("Deleted all moods")
	await populateMoods()
	console.log("Populated moods")
}

async function populateMoods() {
	await prisma.mood.createMany({
		data: moods,
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})

	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
