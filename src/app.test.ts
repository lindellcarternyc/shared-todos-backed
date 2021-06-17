const request = require('supertest')
const { createApplication } = require('./app')

describe('app works', () => {
  it('should work!', () => {
    const app = request(createApplication)
    app.get('/')
      .expect(200)
  })
})