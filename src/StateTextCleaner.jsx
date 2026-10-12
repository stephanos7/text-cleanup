import { useState } from 'react'
import Logo from './Logo'
import TextStats from './TextStats'
import TextLimitFeedback from './TextLimitFeedback'
import { HISTORY_LIMIT, MAX_TEXT_LENGTH } from './textCleanerConfig'
import {
  pasteExceedsLimit,
  PASTE_LENGTH_ERROR,
  TEXT_LENGTH_ERROR,
} from './textLimits'
import './App.css'

export default function StateTextCleaner() {
  const [presentText, setPresentText] = useState('')
  const [pastText, setPastText] = useState([])
  const [futureText, setFutureText] = useState([])
  const [error, setError] = useState(null)
  const canUndo = pastText.length > 0
  const canRedo = futureText.length > 0

  const updateText = (nextText) => {
    if (nextText.length > MAX_TEXT_LENGTH) {
      setError(TEXT_LENGTH_ERROR)
      return
    }
    setError(null)
    if (nextText === presentText) return
    setPresentText(nextText)
    setPastText([presentText, ...pastText].slice(0, HISTORY_LIMIT))
    setFutureText([])
  }

  const handleUpdatePresentText = (event) => {
    updateText(event.target.value)
  }

  const handlePaste = (event) => {
    if (
      pasteExceedsLimit(
        event.currentTarget,
        event.clipboardData.getData('text/plain'),
      )
    ) {
      event.preventDefault()
      setError(PASTE_LENGTH_ERROR)
      return
    }
    setError(null)
  }

  const handleRemoveExtraSpaces = () => {
    const nextText = presentText.replace(/[ \t]+/g, ' ')
    updateText(nextText)
  }

  const handleRemoveBlankLines = () => {
    const nextText = presentText
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .join('\n')
    updateText(nextText)
  }

  const handleJoinAllLines = () => {
    const nextText = presentText.replace(/\r?\n/g, ' ')
    updateText(nextText)
  }

  const handleMakeLowercase = () => {
    const nextText = presentText.toLowerCase()
    updateText(nextText)
  }

  const handleUndo = () => {
    if (!canUndo) return
    setError(null)
    const previousText = pastText[0]
    const newPastText = pastText.slice(1)
    setPresentText(previousText)
    setPastText(newPastText)
    setFutureText([presentText, ...futureText])
  }

  const handleRedo = () => {
    if (!canRedo) return
    setError(null)
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
          <TextLimitFeedback error={error} />
          <textarea
            id="text-input"
            placeholder="Paste or type your text here…"
            value={presentText}
            onChange={handleUpdatePresentText}
            onPaste={handlePaste}
            maxLength={MAX_TEXT_LENGTH}
            aria-invalid={Boolean(error)}
            aria-describedby="text-limit-help"
            spellCheck="false"
          />
        </div>
        <TextStats text={presentText} />
      </section>
    </div>
  )
}
