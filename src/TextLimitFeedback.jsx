import { MAX_TEXT_LENGTH } from './textCleanerConfig'

export default function TextLimitFeedback({ error }) {
  return (
    <div className="editor-field-heading">
      <label htmlFor="text-input">Your text</label>
      <p
        id="text-limit-help"
        className={
          error ? 'text-limit-help text-limit-help--error' : 'text-limit-help'
        }
        role={error ? 'alert' : undefined}
      >
        Max {MAX_TEXT_LENGTH.toLocaleString()} characters.
      </p>
    </div>
  )
}
