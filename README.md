# Vue Relation

> A set of Vue.js mixins for modelling relations between components

## Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [License](#license)

## Installation

```sh
$ yarn add vue-relation
```

## Usage

```js
import {relation, hasOne, memberOf} from 'vue-relation';

const family = relation()

const parent = {
  mixins: [
    hasOne(family, 'child')
  ],
  created () {
    console.log(this.child)
  }
}

const child = {
  mixins: [
    memberOf(family, 'parent')
  ],
  created () {
    console.log(this.parent)
  }
}
```

## License

Copyright &copy; 2017 [Kasper Kronborg Isager](https://github.com/kasperisager). Licensed under the terms of the [MIT license](LICENSE.md).
