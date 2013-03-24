# git-walk-tree

given a commit object, walk its associated tree. exposed
as a `readable` stream.

```javascript
var load = require('git-fs-repo')
  , walk = require('git-walk-tree')

load('.git', function(err, git) {
  var head = git.ref('HEAD').hash
  git.find(head, gothead)

  function gothead(err, commit) {
    walk(git.find.bind(git), commit)
      .on('data', console.log)
  }
})

```

## API

#### walk(findhash function, commit[, ignoreObject]) -> readable stream

given a function to lookup hashes and a commit object, walk
the tree represented by `commit`.

`ignoreObject` maps hashes to ignore to `true` and can be changed
by the caller at any point during execution -- use this to exclude
known subdirectories.

## License

MIT
