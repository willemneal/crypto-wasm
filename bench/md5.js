const Benchmark = require('benchmark')
const { md5 } = require('../pkg')
const { createHash } = require('crypto')
const { MD5 } = require('crypto-js')
const bindings = require('./binding')
const fs = require('fs')

const fixture = 'hello world!' // fs.readFileSync('./bench/fixture.json').toString()

const md5Binding = bindings.md5
const suite = new Benchmark.Suite

suite.add('sha1#native', () => {
  const hasher = createHash('md5')
  hasher.update(fixture)
  hasher.digest('hex')
})
  .add('sha1#wasm', () => {
    md5(fixture)
  })
  .add('sha1#js', () => {
    MD5(fixture).toString()
  })
  .add('sha1#binding', () => {
    md5Binding(fixture)
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()