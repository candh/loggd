# [loggd](https://haider.gitbook.io/loggd/)

[![Travis](https://img.shields.io/travis/candh/loggd.svg)](https://travis-ci.org/candh/loggd)
[![npm](https://img.shields.io/npm/dm/loggd.svg)](https://www.npmjs.com/package/loggd)
[![npm](https://img.shields.io/npm/v/loggd.svg)](https://www.npmjs.com/package/loggd)
[![npm](https://img.shields.io/npm/l/loggd.svg)](https://www.npmjs.com/package/loggd)

Listen, you just want to log something? or might just want to save and retrieve [JSON](http://www.json.org/) and perform basic operations on the data, like a database? Don't want to learn a big library to do that? You're in luck! Because loggd is aimed to solve all of these problems for you! Let me show you 😊

```json
[
  {
    "loggd": {
      "what": "A simple JSON database without complicating stuff",
      "why?": "It provides a simple interface to interact with a JSON file. CRUD, you got it",
      "isCool": true,
      "nestedObjects?": {
        "You": "Got It!"
      },
      "arrays?": ["No", "Problem"]
    },
    "_id": "49c6f6ee-5805-4499-95e0-53bfc0bdc7ad"
  }
]
```

### Installation

```bash
$ npm install loggd --save
```

<br>

For API documentation, detailed explanation and examples:

# [Read The Docs](https://haider.gitbook.io/loggd/)

### Tests

```bash
$ npm test
```

### Contribution

See [`CONTRIBUTING.md`](https://github.com/candh/loggd/blob/master/CONTRIBUTING.md)

### Changelog

Added in version 2.0.0

**v2.2.0**

- Only adds an \_id field if not already specified. Be careful, now its up to you to make them unique if you did in fact supply your own.
- Ran prettier on the whole project

**v2.1.0**

- 🎉 new method: clear() - Clears the database file
- Replaced stupid docstrings with jsdocs. should display a little bit of help on your fancy editors now.
- Better tests. Really. (i think, [i mean you can never be THAT sure..](https://pbs.twimg.com/media/Ci9dn7vWYAAGbuV.jpg))
- Updated dependencies
- Moved db dir to test
- Refactoring
- Loggd is a class now. (Nothing for you to worry about)

**v2.0.0**

- **MAJOR API CHANGES**, If your project is using a previous version and you update this package, **everything will break!** I'm really sorry! But this is the cleanest version yet. Please [read the docs](https://haider.gitbook.io/loggd/). If you liked the previous version, You'll ❤️ this one!

### Wait, who made it?

By [@candhforlife](http://twitter.com/candhforlife) mostly seen at COMSATS Lahore doing CS stuff to get a CS degree
