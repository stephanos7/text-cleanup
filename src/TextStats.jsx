export default function TextStats({ text }) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <footer className="editor-footer">
      <span>
        {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
      </span>
      <span>
        {text.length.toLocaleString()}{' '}
        {text.length === 1 ? 'character' : 'characters'}
      </span>
    </footer>
  )
}
