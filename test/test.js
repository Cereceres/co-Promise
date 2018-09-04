'use strict'
let assert = require('assert')
let CoPromise = require('../index')

describe('Test for CoPromise', function () {
  before(function () {
    // the generator are called with a arg and next, what is the next generator
    this.gen1 = function * (resolve, reject) {
      // every generator is wrapper with co
      let res = yield Promise.resolve(4)
      assert.equal(res, 4)
      // this promise is resolved with 6
      let dist = Math.random()
      if (dist > 0.5) {
        resolve(dist)
      } else if (dist < 0.2) {
        reject(dist)
      } else {
        throw 'hola'
      }
    }
  })
  it('should resolve the promise', function (done) {
    (new CoPromise(this.gen1))
      .then(function * (res) {
        let _res = yield Promise.resolve(res)
        assert(_res > 0.5) // true
        done()
      })
      .catch(function * (_error) {
        let error = yield Promise.resolve(_error)
        assert(error === 'hola' || error < 0.2) // true
        done()
      })
  })

  it('should resolve the promise', function (done) {
    new CoPromise(function * (resolve) {
      const p = new CoPromise(function * (resolve) {
        const res = yield Promise.resolve(2)
        assert(res === 2)
        resolve(res * 3)
      })
      const res = yield p
      resolve(res)
    })
      .then(function * (res) {
        let _res = yield Promise.resolve(res)
        assert(_res === 6) // true
        done()
      })
  })
})
