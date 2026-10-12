import { HISTORY_LIMIT, MAX_TEXT_LENGTH } from './textCleanerConfig.js'
import { TEXT_LENGTH_ERROR } from './textLimits.js'

export const initialState = { past: [], present: '', future: [], error: null }

export const textReducer = (state, action) => {
  let nextText

  if (action.type === 'INPUT_REJECTED') {
    return { ...state, error: action.error }
  } else if (action.type === 'CLEAR_ERROR') {
    return state.error ? { ...state, error: null } : state
  } else if (action.type === 'TEXT_CHANGED') {
    nextText = action.value
  } else if (action.type === 'EXTRA_SPACES_REMOVED') {
    nextText = state.present.replace(/[ \t]+/g, ' ')
  } else if (action.type === 'BLANK_LINES_REMOVED') {
    nextText = state.present
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .join('\n')
  } else if (action.type === 'LINES_JOINED') {
    nextText = state.present.replace(/\r?\n/g, ' ')
  } else if (action.type === 'LOWERCASE_APPLIED') {
    nextText = state.present.toLowerCase()
  } else if (action.type === 'UNDO') {
    if (state.past.length === 0) return state
    return {
      past: state.past.slice(1),
      present: state.past[0],
      future: [state.present, ...state.future],
      error: null,
    }
  } else if (action.type === 'REDO') {
    if (state.future.length === 0) return state
    return {
      past: [state.present, ...state.past],
      present: state.future[0],
      future: state.future.slice(1),
      error: null,
    }
  } else {
    throw new Error("This action type isn't supported.")
  }

  if (nextText.length > MAX_TEXT_LENGTH) {
    return { ...state, error: TEXT_LENGTH_ERROR }
  }

  if (nextText === state.present) {
    return state.error ? { ...state, error: null } : state
  }

  return {
    past: [state.present, ...state.past].slice(0, HISTORY_LIMIT),
    present: nextText,
    future: [],
    error: null,
  }
}
