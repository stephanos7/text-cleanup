import reducerPage from './ReducerTextCleaner.jsx?raw'
import reducer from './textReducer.js?raw'
import statePage from './StateTextCleaner.jsx?raw'

export const implementationSources = {
  reducer: {
    title: 'React useReducer',
    files: [
      { name: 'ReducerTextCleaner.jsx', code: reducerPage },
      { name: 'textReducer.js', code: reducer },
    ],
  },
  state: {
    title: 'React useState',
    files: [
      { name: 'StateTextCleaner.jsx', description: 'The UI, state and update handlers in one component.', code: statePage },
    ],
  },
}
