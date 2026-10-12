import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { initialState, textReducer } from '../src/textReducer.js'
import { HISTORY_LIMIT, MAX_TEXT_LENGTH } from '../src/textCleanerConfig.js'
import {
  pasteExceedsLimit,
  PASTE_LENGTH_ERROR,
  TEXT_LENGTH_ERROR,
} from '../src/textLimits.js'

const edit = (state, value) =>
  textReducer(state, { type: 'TEXT_CHANGED', value })

function assertHistoryUnchanged(before, after) {
  assert.equal(after.present, before.present)
  assert.equal(after.past, before.past)
  assert.equal(after.future, before.future)
}

test('retains the newest transitions and traverses the same bounded history in both directions', () => {
  let state = initialState
  const changes = HISTORY_LIMIT + 5
  for (let index = 1; index <= changes; index++) {
    state = edit(state, String(index))
    assert.ok(state.past.length + state.future.length <= HISTORY_LIMIT)
  }
  assert.equal(state.past.length, HISTORY_LIMIT)
  for (let index = 1; index <= HISTORY_LIMIT; index++) {
    state = textReducer(state, { type: 'UNDO' })
    assert.equal(state.present, String(changes - index))
    assert.equal(state.past.length + state.future.length, HISTORY_LIMIT)
  }
  assert.equal(textReducer(state, { type: 'UNDO' }), state)
  for (let index = 1; index <= HISTORY_LIMIT; index++) {
    state = textReducer(state, { type: 'REDO' })
    assert.equal(state.present, String(changes - HISTORY_LIMIT + index))
    assert.equal(state.past.length + state.future.length, HISTORY_LIMIT)
  }
  assert.equal(textReducer(state, { type: 'REDO' }), state)
})

test('new edits discard future, while unchanged actions preserve history', () => {
  let state = edit(edit(initialState, 'first'), 'second')
  state = textReducer(state, { type: 'UNDO' })
  assert.equal(edit(state, state.present), state)
  assert.equal(textReducer(state, { type: 'LOWERCASE_APPLIED' }), state)
  state = edit(state, 'branch')
  assert.deepEqual(state.future, [])
  assert.equal(state.past[0], 'first')
})

test('accepts boundary lengths and rejects oversized text without touching history', () => {
  let state = edit(initialState, 'x'.repeat(MAX_TEXT_LENGTH - 1))
  state = edit(state, 'x'.repeat(MAX_TEXT_LENGTH))
  const rejected = edit(state, 'x'.repeat(MAX_TEXT_LENGTH + 1))
  assertHistoryUnchanged(state, rejected)
  assert.equal(rejected.error, TEXT_LENGTH_ERROR)
  const accepted = edit(rejected, 'short')
  assert.equal(accepted.error, null)
  assert.equal(accepted.past[0].length, MAX_TEXT_LENGTH)
})

test('Unicode lowercase expansion is rejected and errors are outside history', () => {
  const state = edit(initialState, '\u0130'.repeat(MAX_TEXT_LENGTH))
  const rejected = textReducer(state, { type: 'LOWERCASE_APPLIED' })
  assertHistoryUnchanged(state, rejected)
  assert.equal(rejected.error, TEXT_LENGTH_ERROR)
  const pasteRejected = textReducer(rejected, {
    type: 'INPUT_REJECTED',
    error: PASTE_LENGTH_ERROR,
  })
  assertHistoryUnchanged(rejected, pasteRejected)
  const cleared = textReducer(pasteRejected, { type: 'CLEAR_ERROR' })
  assertHistoryUnchanged(pasteRejected, cleared)
  assert.equal(cleared.error, null)
})

test('accepted no-op cleaning, undo, and redo clear errors without adding snapshots', () => {
  let state = edit(edit(initialState, 'one'), 'two')
  state = textReducer(state, {
    type: 'INPUT_REJECTED',
    error: PASTE_LENGTH_ERROR,
  })
  const noOp = textReducer(state, { type: 'LINES_JOINED' })
  assertHistoryUnchanged(state, noOp)
  assert.equal(noOp.error, null)
  state = textReducer(state, { type: 'UNDO' })
  assert.equal(state.error, null)
  state = textReducer(state, {
    type: 'INPUT_REJECTED',
    error: PASTE_LENGTH_ERROR,
  })
  state = textReducer(state, { type: 'REDO' })
  assert.equal(state.error, null)
  assert.equal(state.present, 'two')
})

test('paste checks account for selection, line ending normalisation, and UTF-16 units', () => {
  const textarea = {
    value: 'x'.repeat(MAX_TEXT_LENGTH),
    selectionStart: 0,
    selectionEnd: 0,
  }
  assert.equal(pasteExceedsLimit(textarea, 'a'), true)
  textarea.selectionEnd = 2
  assert.equal(pasteExceedsLimit(textarea, '😀'), false)
  assert.equal(pasteExceedsLimit(textarea, '😀a'), true)
  assert.equal(pasteExceedsLimit(textarea, '\r\n\r'), false)
})

test('configuration changes propagate through reducer and paste checks', async () => {
  const moduleUrl = (source) =>
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
  const configUrl = moduleUrl(
    'export const HISTORY_LIMIT = 2; export const MAX_TEXT_LENGTH = 3;',
  )
  const limitsSource = await readFile(
    new URL('../src/textLimits.js', import.meta.url),
    'utf8',
  )
  const limitsUrl = moduleUrl(
    limitsSource.replace("'./textCleanerConfig.js'", JSON.stringify(configUrl)),
  )
  const reducerSource = await readFile(
    new URL('../src/textReducer.js', import.meta.url),
    'utf8',
  )
  const reducerUrl = moduleUrl(
    reducerSource
      .replace("'./textCleanerConfig.js'", JSON.stringify(configUrl))
      .replace("'./textLimits.js'", JSON.stringify(limitsUrl)),
  )
  const {
    initialState: configuredInitialState,
    textReducer: configuredReducer,
  } = await import(reducerUrl)
  const limits = await import(limitsUrl)
  let state = configuredInitialState
  for (const value of ['a', 'b', 'c'])
    state = configuredReducer(state, { type: 'TEXT_CHANGED', value })
  assert.equal(state.past.length, 2)
  const rejected = configuredReducer(state, {
    type: 'TEXT_CHANGED',
    value: 'abcd',
  })
  assertHistoryUnchanged(state, rejected)
  assert.match(rejected.error, /3-character/)
  assert.equal(
    limits.pasteExceedsLimit(
      { value: 'abc', selectionStart: 0, selectionEnd: 0 },
      'd',
    ),
    true,
  )
})
