export const initialState = { past: [], present: '', future: [] }

export const textReducer = (state, action) => {
  let nextText

  if (action.type === 'TEXT_CHANGED') {
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
    }
  } else if (action.type === 'REDO') {
    if (state.future.length === 0) return state
    return {
      past: [state.present, ...state.past],
      present: state.future[0],
      future: state.future.slice(1),
    }
  } else {
    throw new Error("This action type isn't supported.")
  }

  if (nextText === state.present) {
    return state
  }

  return {
    past: [state.present, ...state.past],
    present: nextText,
    future: [],
  }
}
