import {useState} from "react"
import './App.css'

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

export default function StateTextCleaner() {
  const [text, setText] = useState("Starter text")
  // const wordCount = text.present.trim()
  //   ? text.present.trim().split(/\s+/).length
  //   : 0;

  const handleUpdateText = (event) => {
    setText(event.target.value)
  }

  const handleRemoveExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, " "))
  }

  const handleRemoveBlankLines = () => {
    setText(
      text
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "")
        .join("\n")
    )
  }

  const handleJoinAllLines = () => {
    setText(text.replace(/\r?\n/g, " "))
  }

  const handleMakeLowercase = () => {
    setText(text.toLowerCase())
  }   

  return (
    <div className="app">
      <header className="page-header">
        <div className="heading-row">
          <span className="app-mark" aria-hidden="true">
            T<span>.</span>
          </span>
          <h1>[STATE] Text cleaner</h1>
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
              onClick={handleRemoveExtraSpaces}
              disabled={!text}
            >
              Remove extra spaces
            </button>
            <button
              className="action-button"
              onClick={handleRemoveBlankLines}
              disabled={!text}
            >
              Remove blank lines
            </button>
            <button
              className="action-button"
              onClick={handleJoinAllLines}
              disabled={!text}
            >
              Join all lines
            </button>
            <button
              className="action-button"
              onClick={handleMakeLowercase}
              disabled={!text}
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
              onClick={() => {}}
              // disabled={!text.past.length}
              aria-label="Undo"
              title="Undo"
            >
              <HistoryIcon />
              <span>Undo</span>
            </button>
            <button
              className="history-button"
              onClick={() => {}}
              // disabled={!text.future.length}
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
            value={text}
            onChange={handleUpdateText}
            spellCheck="false"
          />
        </div>
        <footer className="editor-footer">
          <span>
            {/* {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"} */}
          </span>
          <span>
            {/* {text.present.length.toLocaleString()}{" "}
            {text.present.length === 1 ? "character" : "characters"} */}
          </span>
        </footer>
      </section>
    </div>
  );
}