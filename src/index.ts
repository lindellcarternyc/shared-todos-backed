import 'reflect-metadata'
import { startApplication } from './app'

const main = async () => {
  startApplication({ port: 8314 })
}

main()
  .then(() => console.log('Started server'))
  .catch(err => {
    console.error(err)
  })