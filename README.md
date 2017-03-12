<p><h1 align="center">objecthistory</h1></p>

<p align="center">:four_leaf_clover: Object undo, redo & change history using Proxy</p>

<p align="center">Made with ❤ at <a href="http://www.twitter.com/outlandish">@outlandish</a></p>

<hr/>

:cookie: Simple undo and redo for objects.

:sparkles: Compiled using [`babili`](https://github.com/babel/babili) for ES2015 environments.

:point_right: Use your preferred bundler and transpiler as required.

## Example

```js
const input = history({ value: '' })

input.value = 'Ziggy'
input.value = 'Stardust'

input.$$index //=> 2
input.$$history() //=> [{ value: '' }, { value: 'Ziggy' }]

input.$$undo()
input.$$index //=> 1
input.value //=> 'Ziggy'

input.$$redo()
input.$$index //=> 2
input.value //=> 'Stardust'
```

## Install

```sh
npm install --save objecthistory
```

```sh
yarn add objecthistory
```

## Import

```js
// ES2015
import history from 'objecthistory'
```

```js
// CommonJS
var history = require('objecthistory')
```

## Usage

### `history([obj]) : Object`

Enhance an object with undo, redo & change history.

- [__obj__] {Object} _(optional, default=`{}`)_ Object to enhance

Returns enhanced object.
 
## API

An enhanced object has the following methods.

### `obj.$$index : Number`

The current position of the object in the history of changes, which represents the current value of the object. 

- An `undo` moves the cursor backwards in the history.

- A `redo` moves the cursor forwards in the history.

- Any forward history is lost when a new change is made.

### `obj.$$undo([n]) : Object`

Undo `n` changes to the object.

- [__n__] {Number} _(optional, default=`1`)_ Number of redos to apply

### `obj.$$redo([n]) : Object`

Re-apply `n` undone changes to the object.

- [__n__] {Number} _(optional, default=`1`)_ Number of redos to apply

### `obj.$$history([n]) : Array`

Get an array of `n` history items.

- [__n__] {Number} _(optional, default=`Infinity`)_ Number of history items to retrieve

### `obj.$$historyBackward([n]) : Array`

Get an array of `n` history items before `$$index`.

- [__n__] {Number} _(optional, default=`Infinity`)_ Number of history items to retrieve

### `obj.$$historyForward([n]) : Array`

Get an array of `n` history items after `$$index`.

- [__n__] {Number} _(optional, default=`Infinity`)_ Number of history items to retrieve

## Contributing

All pull requests and issues welcome!

If you're not sure how, check out the [great video tutorials on egghead.io](http://bit.ly/2aVzthz)!
