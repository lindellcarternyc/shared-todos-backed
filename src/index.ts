import 'reflect-metadata'
import { startApplication } from './app'

import dotenv from 'dotenv'
dotenv.config()

// const dotenvRes = dotenv.config()
// console.log(dotenvRes)
// if (dotenvRes.error) {
//   console.log('error parsing .env', dotenvRes.error)
//   process.exit(1)
// }

const main = async () => {
  startApplication({ port: 8314 })
}

main()
  .then(() => console.log('Started server'))
  .catch(err => {
    console.error(err)
  })