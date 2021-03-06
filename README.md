
# co-promising
co-promising for JavaScript

# Installing

```bash
$ npm install co-promising
```

# Getting starter

```js

let CoPromise = require( 'co-promising' )
```
# Usage

Create

```js

//the generator are called with a arg and next, what is the next generator
let gen1 = function*(resolve, reject) {
  // every generator is wrapper with co
  let res = yield Promise.resolve(4)
  assert.equal(res, 4)
    //this promise is resolved with 6
  let dist = Math.random()
  if (dist > 0.5) {
    resolve(dist)
  } else if (dist < 0.2) {
    reject(dist)
  } else {
    throw 'hola'
  }
}
CoPromise(gen1)
.then(function*(res) {
    let _res = yield Promise.resolve(res)
    assert(_res > 0.5) // true
    done()
  })
  .catch(function*(_error) {
    let error = yield Promise.resolve(_error)
    assert(error === 'hola' || error < 0.2) // true
    done()
  })
```
### `Class co-promising`
#### `co-promising(Generator,[thisArg])`
To instance the co-promising you pass the Generator to be iterated and a thisArg to be used

### `Class co-promising`

#### co-promising.reject(error) => CoPromisesRejected
#### co-promising.resolve(res) => CoPromisesResolved
#### co-promising.all(arrayPromises) => CoPromisesResolvedWithArrayPromises

### `Instance co-promising method`
#### `co-promising.then(resHandler[,rejHandler])`
This method is like the ordinary promises, but resHandler and rejHandler are Generators, return a co-promising.

#### `co-promising.catch(rejHandler)`
This method is like the ordinary promises, but  rejHandler are Generators, return a co-promising.

#### `co-promising.ctx`
thisArg passed to every generator, this is the same passed to constructor like thisArg and can be
upgraded at any time.

# Testing

Running the tests

```bash
npm test
```


## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.  For any bugs report please contact to me via e-mail: cereceres@ciencias.unam.mx.

## Licence
The MIT License (MIT)

Copyright (c) 2015 Jesús Edel Cereceres.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
