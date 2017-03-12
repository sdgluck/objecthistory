'use strict'

const test = require('tape')
const enhance = require('./index')

test('throws without object', (t) => {
  t.throws(() => enhance(''), /expecting value to be plain object/i)
  t.end()
})

test('returns an object', (t) => {
  t.equal(typeof enhance({}), 'object')
  t.end()
})

test('enhances object', (t) => {
  const enhanced = enhance({})
  t.equal(typeof enhanced.$$history, 'function')
  t.equal(typeof enhanced.$$undo, 'function')
  t.equal(typeof enhanced.$$redo, 'function')
  t.equal(typeof enhanced.$$index, 'number')
  t.end()
})

test('preserves original properties', (t) => {
  const enhanced = enhance({ lazarus: '' })
  t.equal(enhanced.lazarus, '')
  t.end()
})

test('records successive changes', (t) => {
  const enhanced = enhance({})
  enhanced.spongebob = 'squarepants'
  enhanced.curb = { your: 'enthusiasm' }
  const history = enhanced.$$history()
  t.deepEqual(history[0], {})
  t.deepEqual(history[1], { spongebob: 'squarepants' })
  t.deepEqual(history[2], {
    spongebob: 'squarepants',
    curb: { your: 'enthusiasm' }
  })
  t.end()
})

test('can undo, redo a change', (t) => {
  const enhanced = enhance({ value: 'Hello' })
  enhanced.value = 'Hello Sam'
  t.equal(enhanced.value, 'Hello Sam')
  const history = enhanced.$$history(1)
  t.deepEqual(history[0], { value: 'Hello' })
  t.deepEqual(history[1], { value: 'Hello Sam' })
  enhanced.$$undo()
  t.equal(enhanced.value, 'Hello')
  enhanced.$$redo()
  t.equal(enhanced.value, 'Hello Sam')
  t.end()
})

test('can redo multiple changes', (t) => {
  const enhanced = enhance({ value: 'Hello' })
  enhanced.value = 'Hello Sam'
  enhanced.value = 'Hello David'
  enhanced.value = 'Hello Ahmed'
  enhanced.$$undo(3)
  t.equal(enhanced.value, 'Hello')
  enhanced.$$redo(3)
  t.equal(enhanced.value, 'Hello Ahmed')
  t.end()
})

test('forgets forward history with new changes after undo', (t) => {
  const enhanced = enhance({ value: 'Hello' })
  enhanced.value = 'Hello Sam'
  enhanced.value = 'Hello David'
  enhanced.value = 'Hello Ahmed'
  t.equal(enhanced.$$index, 3)
  t.deepEqual(enhanced.$$history(), [
    { value: 'Hello' },
    { value: 'Hello Sam' },
    { value: 'Hello David' },
    { value: 'Hello Ahmed' }
  ])
  enhanced.$$undo()
  enhanced.$$undo()
  t.equal(enhanced.$$index, 1)
  t.equal(enhanced.$$history().length, 4)
  t.equal(enhanced.value, 'Hello Sam')
  t.deepEqual(enhanced.$$history(), [
    { value: 'Hello' },
    { value: 'Hello Sam' },
    { value: 'Hello David' },
    { value: 'Hello Ahmed' }
  ])
  enhanced.value = 'Hello Adam'
  t.equal(enhanced.$$index, 2)
  t.equal(enhanced.$$history().length, 3)
  t.deepEqual(enhanced.$$history(), [
    { value: 'Hello' },
    { value: 'Hello Sam' },
    { value: 'Hello Adam' }
  ])
  t.end()
})

test('can get backward history', (t) => {
  const enhanced = enhance({})
  enhanced.value = 'T.S. Eliot'
  enhanced.value = 'Ham On Rye'
  enhanced.value = 'Ginsberg'
  enhanced.value = 'Kazuo Ishiguro'
  t.equal(enhanced.$$index, 4)
  t.deepEqual(enhanced.$$historyBackward(), [
    {},
    { value: 'T.S. Eliot' },
    { value: 'Ham On Rye' },
    { value: 'Ginsberg' },
    { value: 'Kazuo Ishiguro' }
  ])
  enhanced.value = 'Are you an echo?'
  t.equal(enhanced.$$index, 5)
  t.end()
})

test('can get forward history', (t) => {
  const enhanced = enhance({})
  enhanced.value = 'T.S. Eliot'
  enhanced.value = 'Ham On Rye'
  enhanced.value = 'Ginsberg'
  enhanced.value = 'Kazuo Ishiguro'
  enhanced.$$undo(2)
  t.equal(enhanced.$$index, 2)
  t.deepEqual(enhanced.$$historyForward(), [
    { value: 'Ginsberg' },
    { value: 'Kazuo Ishiguro' }
  ])
  enhanced.value = 'Are you an echo?'
  t.equal(enhanced.$$index, 3)
  t.end()
})
