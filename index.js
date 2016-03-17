'use strict'
const co = require('co')
  /**
   * @param {Object} to be use as thisArg in every generator
   * @return {Object} instance of CoPromise
   * @api public
   */
class CoPromise {
  constructor(generator, ctx) {
    /**
     * if is not called with new, a instance of CoPromise is returned
     */
    this.generator = generator
      /**
       *  ctx to be used in every generator
       */
    this.ctx = ctx || this
    var _this = this
      /**
       *  EventEmitter is instanced and added to object
       */
    this.promise = new Promise(function(resolve, reject) {
      co.call(_this.ctx, _this.generator, resolve, reject).then(
        function(res) {
          _this.coRes = res
          return res
        }).catch(function(error) {
        _this.coError = error
        reject(error)
      })
    });

    /**on method to be added to instance*/
    /**
     * @param {String} event {Array} _eventHandler of generator to be used,
     * can be too onle one generator
     * @return {Boolean} is listener was added
     * @api public
     */
    this.then = function(resHandler, rejHandler) {
      let _p = new CoPromise(function*(resolve, rej) {
        let p = _this.promise
          .then(function(res) {
            co.call(_this.ctx, resHandler, res || _this.coRes).then(
              resolve).catch(rej)
          })
        p.catch(function(error) {
          _this.coError = error || _this.coError
          if (typeof rejHandler === 'function') {
            co.call(_this.ctx, rejHandler, _this.coError).then(
              resolve).catch(rej)
          } else {
            _p.coError = error || _this.coError
            rej(_p.coError)
            return
          }
        })
        yield Promise.resolve()
      }, _this.ctx)
      return _p
    }
    this.catch = function(rejHandler) {
      let _p = new CoPromise(function*(resolve, rej) {
        if (typeof rejHandler === 'function') {
          _this.promise.catch(function(error) {
            _this.coError = error || _this.coError
            co.call(_this.ctx, rejHandler, _this.coError)
              .then(
                resolve).catch(rej)
          })
        } else {
          _p.coError = _this.coError
        }
        yield Promise.resolve()
      }, _this.ctx)
      return _p
    }
  }
}


/**
 * Expose `CoPromise`.
 */
module.exports = CoPromise
