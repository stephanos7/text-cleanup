import { useReducer } from 'react'
import './App.css'

const initialState = { past: [], present: '', future: [] }

const textReducer = (state, action) => {
  let nextText;

  if(action.type === "TEXT_CHANGED") {
    nextText = action.value;
  } else if (action.type === "EXTRA_SPACES_REMOVED") {
    nextText = state.present.replace(/[ \t]+/g, " ");
  } else if (action.type === "BLANK_LINES_REMOVED") {
    nextText = state.present
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .join("\n");
  } else if(action.type === "UNDO") {
    if (state.past.length === 0) return state;
        return {
          past: state.past.slice(1),
          present: state.past[0],
          future: [state.present, ...state.future]
        };
  }else if(action.type === "REDO") {
    if (state.future.length === 0) return state;
      return {
        past: [state.present, ...state.past],
        present: state.future[0],
        future: state.future.slice(1)
      };
  } else {
  
    throw new Error("This action type isn't supported.");
  }

  // Don't record changes that leave the text identical.
  if (nextText === state.present) {
    return state;
  } 


   return {
     past: [state.present, ...state.past],
     present: nextText,
     future: []
   };

};


function HistoryIcon({ redo = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g transform={redo ? 'translate(24 0) scale(-1 1)' : undefined}>
        <path d="M9 5 4 10l5 5" />
        <path d="M4 10h10a6 6 0 0 1 6 6v3" />
      </g>
    </svg>
  )
}

function App() {
  const [text, dispatch] = useReducer(textReducer, initialState)
  const wordCount = text.present.trim() ? text.present.trim().split(/\s+/).length : 0

  return (
    <main className="app">
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
              onClick={() => dispatch({ type: "EXTRA_SPACES_REMOVED" })}
              disabled={!text.present}
            >
              Remove extra spaces
            </button>
            <button
              className="action-button"
              onClick={() => dispatch({ type: "BLANK_LINES_REMOVED" })}
              disabled={!text.present}
            >
              Remove blank lines
            </button>
          </div>
          <div
            className="history-actions"
            role="group"
            aria-label="Text history"
          >
            <button
              className="history-button"
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!text.past.length}
              aria-label="Undo"
              title="Undo"
            >
              <HistoryIcon />
              <span>Undo</span>
            </button>
            <button
              className="history-button"
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!text.future.length}
              aria-label="Redo"
              title="Redo"
            >
              <HistoryIcon redo />
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
              dispatch({ type: "TEXT_CHANGED", value: event.target.value })
            }
            spellCheck="false"
          />
        </div>
        <footer className="editor-footer">
          <span>
            {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
          </span>
          <span>
            {text.present.length.toLocaleString()}{" "}
            {text.present.length === 1 ? "character" : "characters"}
          </span>
        </footer>
      </section>
    </main>
  );
}

export default App
