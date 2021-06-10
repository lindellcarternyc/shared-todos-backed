import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  console.log('this is a seed file')
  try {
    await prisma.user.deleteMany({})
  } catch (err) {
    console.log(err)
    throw err
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(err => {
    console.error(err)
    process.exit(1)
  })