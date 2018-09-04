const co = require('co')
var isGenerator = require('is-generator')
var isGeneratorFn = require('is-generator').fn
class CoPromise {
  constructor (generator, ctx) {
    this.generator = generator
    this.ctx = ctx
    this.promise = new Promise((resolve, reject) => co
      .call(ctx || this, generator, resolve, reject))
  }

  then (resHandler, rejHandler) {
    if (isGenerator(resHandler) || isGeneratorFn(resHandler)) {
      this.promise = this
        .promise.then((res) => co.call(this, resHandler, res))
    } else if (isGenerator(rejHandler) || isGeneratorFn(rejHandler)) {
      this.promise = this
        .promise.catch(err => co.call(this, rejHandler, err))
    } else {
      this.promise = this
        .promise.then(resHandler, rejHandler)
    }

    return this
  }
  catch (rejHandler) {
    if (isGenerator(rejHandler) || isGeneratorFn(rejHandler)) {
      this.promise = this
        .promise.catch(err => {
          return co.call(this, rejHandler, err)
        })
    } else {
      this.promise = this.promise.catch(err => {
        return rejHandler(err)
      })
    }

    return this
  }

  static all (arrayPromises) {
    return new CoPromise(function * (resolve, reject) {
      const res = yield Promise.all(arrayPromises).catch(reject)
      resolve(res)
    }, this)
  }

  static reject (error) {
    return new CoPromise(function * (resolve, reject) { return reject(error) })
  }

  static resolve (res) {
    return new CoPromise(function * (resolve) { return resolve(res) })
  }
}

module.exports = CoPromise
