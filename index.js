const co = require('co')

class CoPromise{
  constructor(generator, ctx) {
    this.generator = generator
    this.ctx = ctx
    var _this = this
    this.promise = new Promise((resolve, reject) => co
      .call(ctx || this, _this.generator, resolve, reject))
  }

    then(resHandler, rejHandler) {
      this.promise= this.promise.then((res)=>co.call(this, resHandler, res))
      if (rejHandler) this.promise = this.promise.catch(err => co.call(this,rejHandler, err))

     return this
    }
    catch(rejHandler) {
      this.promise = this.promise.catch(err => co.call(this,rejHandler, err))

     return this
    }

    static all(arrayPromises){
      return new CoPromise(function*(resolve, reject){
        const res = yield Promise.all(arrayPromises).catch(reject)
        resolve(res)
      }, this)
    }

    static reject(error){
      return new CoPromise(function*(resolve, reject){return reject(error)})
    }

    static resolve(res){
      return new CoPromise(function*(resolve){return resolve(res)})
    }

}

module.exports = CoPromise
