module.exports = walk

var through = require('through')

function walk(findhash, commit, ignore) {
  var stream = through(noop, end)
    , ended = false
    , stack = []

  ignore = ignore || {} 

  stream.writable = false
  process.nextTick(start)

  return stream

  function noop() {

  }

  function end() {
    ended = true
  }

  function start() {
    if(stream.paused) {
      return stream.once('drain', start)
    }

    findhash(commit.tree(), gotobject)
  }

  function gotobject(err, object, done) {
    done = done || function() {
      stream.queue(null)
      ended = true
    }
    
    object = object || {};

    if(err) {
      return stream.emit('error', err)
    }

    if(ended) {
      return
    }

    if(stream.paused) {
      return stream.once('drain', function() {
        gotobject(err, object, done)
      })
    }

    object.stack = stack ? stack.slice() : [];
    stream.queue(object)

    var entries = object.entries && object.entries()
      , idx = 0

    if(!entries || !entries.length) {
      return done()
    }

    return iter()

    function iter() {
      if(ended) {
        return
      }

      if(idx === entries.length) {
        return done()
      }

      if(ignore[entries[idx].hash]) {
        ++idx
        return iter()
      }

      stack[stack.length] = entries[idx]

      findhash(entries[idx++].hash, function(err, obj) {
        gotobject(err, obj, function() {
          --stack.length
          iter()
        })
      })
    }

  }
}
