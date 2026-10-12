import { useState } from 'react'
import Logo from './Logo'
import TextStats from './TextStats'
import './App.css'

export default function StateTextCleaner() {
  const [presentText, setPresentText] = useState('Starter text')
  const [pastText, setPastText] = useState([])
  const [futureText, setFutureText] = useState([])
  const canUndo = pastText.length > 0
  const canRedo = futureText.length > 0

  const handleUpdatePresentText = (event) => {
    const nextText = event.target.value
    if (nextText === presentText) return
    setPresentText(nextText)
    setPastText([presentText, ...pastText])
    setFutureText([])
  }

  const handleRemoveExtraSpaces = () => {
    const nextText = presentText.replace(/[ \t]+/g, ' ')
    if (nextText === presentText) return
    setPresentText(nextText)
    const newPastText = [presentText, ...pastText]
    setPastText(newPastText)
    setFutureText([])
  }

  const handleRemoveBlankLines = () => {
    const nextText = presentText
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .join('\n')
    if (nextText === presentText) return
    setPresentText(nextText)
    const newPastText = [presentText, ...pastText]
    setPastText(newPastText)
    setFutureText([])
  }

  const handleJoinAllLines = () => {
    const nextText = presentText.replace(/\r?\n/g, ' ')
    if (nextText === presentText) return
    setPresentText(nextText)
    const newPastText = [presentText, ...pastText]
    setPastText(newPastText)
    setFutureText([])
  }

  const handleMakeLowercase = () => {
    const nextText = presentText.toLowerCase()
    if (nextText === presentText) return
    setPresentText(nextText)
    const newPastText = [presentText, ...pastText]
    setPastText(newPastText)
    setFutureText([])
  }

  const handleUndo = () => {
    if (!canUndo) return
    const previousText = pastText[0]
    const newPastText = pastText.slice(1)
    setPresentText(previousText)
    setPastText(newPastText)
    setFutureText([presentText, ...futureText])
  }

  const handleRedo = () => {
    if (!canRedo) return
    const nextText = futureText[0]
    const newFutureText = futureText.slice(1)
    setPresentText(nextText)
    setFutureText(newFutureText)
    setPastText([presentText, ...pastText])
  }

  return (
    <div className="app">
      <header className="page-header">
        <span className="implementation-chip">Built with React useState</span>
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
              onClick={handleRemoveExtraSpaces}
              disabled={!presentText}
            >
              Remove extra spaces
            </button>
            <button
              className="action-button"
              onClick={handleRemoveBlankLines}
              disabled={!presentText}
            >
              Remove blank lines
            </button>
            <button
              className="action-button"
              onClick={handleJoinAllLines}
              disabled={!presentText}
            >
              Join all lines
            </button>
            <button
              className="action-button"
              onClick={handleMakeLowercase}
              disabled={!presentText}
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
              onClick={handleUndo}
              disabled={!canUndo}
              aria-label="Undo"
              title="Undo"
            >
              <Logo />
              <span>Undo</span>
            </button>
            <button
              className="history-button"
              onClick={handleRedo}
              disabled={!canRedo}
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
            value={presentText}
            onChange={handleUpdatePresentText}
            spellCheck="false"
          />
        </div>
        <TextStats text={presentText} />
      </section>
    </div>
  )
}
