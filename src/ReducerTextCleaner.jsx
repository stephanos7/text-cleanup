import { useReducer } from 'react'
import Logo from './Logo'
import TextStats from './TextStats'
import { initialState, textReducer } from './textReducer'
import './App.css'

export default function ReducerTextCleaner() {
  const [text, dispatch] = useReducer(textReducer, initialState)

  return (
    <div className="app">
      <header className="page-header">
        <div className="heading-row">
          <span className="app-mark" aria-hidden="true">
            T<span>.</span>
          </span>
          <h1>Text cleaner</h1>
        </div>
        <p>
          A little less clutter. A little more clarity. Just your text.
          Everything stays in your browser.
        </p>
      </header>

      <section className="editor" aria-label="Text editor">
        <div className="editor-toolbar">
          <div className="clean-actions" role="group" aria-label="Clean text">
            <button
              className="action-button"
              onClick={() => dispatch({ type: 'EXTRA_SPACES_REMOVED' })}
              disabled={!text.present}
            >
              Remove extra spaces
            </button>
            <button
              className="action-button"
              onClick={() => dispatch({ type: 'BLANK_LINES_REMOVED' })}
              disabled={!text.present}
            >
              Remove blank lines
            </button>
            <button
              className="action-button"
              onClick={() => dispatch({ type: 'LINES_JOINED' })}
              disabled={!text.present}
            >
              Join all lines
            </button>
            <button
              className="action-button"
              onClick={() => dispatch({ type: 'LOWERCASE_APPLIED' })}
              disabled={!text.present}
            >
              Make all lowercase
            </button>
          </div>
          <div
            className="history-actions"
            role="group"
            aria-label="Text history"
          >
            <button
              className="history-button"
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={!text.past.length}
              aria-label="Undo"
              title="Undo"
            >
              <Logo />
              <span>Undo</span>
            </button>
            <button
              className="history-button"
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={!text.future.length}
              aria-label="Redo"
              title="Redo"
            >
              <Logo redo />
              <span>Redo</span>
            </button>
          </div>
        </div>

        <div className="editor-body">
          <label htmlFor="text-input">Your text</label>
          <textarea
            id="text-input"
            placeholder="Paste or type your text here…"
            value={text.present}
            onChange={(event) =>
              dispatch({ type: 'TEXT_CHANGED', value: event.target.value })
            }
            spellCheck="false"
          />
        </div>
        <TextStats text={text.present} />
      </section>
    </div>
  )
}
