import { MAX_TEXT_LENGTH } from './textCleanerConfig.js'

export const TEXT_LENGTH_ERROR = `Text would exceed the ${MAX_TEXT_LENGTH.toLocaleString()}-character limit. Nothing was changed.`
export const PASTE_LENGTH_ERROR = `Paste would exceed the ${MAX_TEXT_LENGTH.toLocaleString()}-character limit. Nothing was pasted.`

export function pasteExceedsLimit(textarea, clipboardText) {
  const normalisedText = clipboardText.replace(/\r\n?/g, '\n')
  const selectedLength = textarea.selectionEnd - textarea.selectionStart
  return (
    textarea.value.length - selectedLength + normalisedText.length >
    MAX_TEXT_LENGTH
  )
}
