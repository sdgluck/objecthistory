'use strict'

const diff = require('changeset')

/**
 * Enhance an object with undo, redo and change history.
 * @param {Object} value
 * @returns {Object} Enhanced object
 */
module.exports = function (value = {}) {
  if (typeof value !== 'object' || value.prototype) {
    throw new Error('Expecting value to be plain object, got ' + typeof value)
  }

  const _history = [diff({}, value)]
  let current = value
  let index = 0

  function history (num, start, end) {
    num = Math.max(num, _history.length)
    const arr = []
    let before = {}
    for (let i = start; i < num; i++) {
      if (!_history[i] || i > end) break
      before = diff.apply(_history[i], before)
      arr.push(before)
    }
    return arr
  }

  function undo (num) {
    if (index > 0) while (num-- && index) {
      current = diff.apply(_history[--index], current)
    }
  }

  function redo (num) {
    if (index < _history.length) {
      while (num-- && (index + 1) in _history) {
        current = diff.apply(_history[++index], current)
      }
    }
  }

  return new Proxy(value, {
    get (_, property) {
      switch (property) {
        case '$$index':           return index
        case '$$history':         return (num = Infinity) => history(num, 0, _history.length)
        case '$$historyForward':  return (num = Infinity) => history(num, index + 1, _history.length)
        case '$$historyBackward': return (num = Infinity) => history(num, 0, index)
        case '$$undo':            return (num = 1) => undo(num)
        case '$$redo':            return (num = 1) => redo(num)
        default:                  return current[property]
      }
    },
    set (target, property, value) {
      const current = Object.assign({}, target)
      target[property] = value
      if (index < _history.length - 1) {
        // remove undone history
        _history.splice(index + 1, _history.length)
      }
      _history.push(diff(current, target))
      index++
      return true
    }
  })
}
