import { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import { implementationSources } from './implementationSources'

function SourceFile({ file, children }) {
  const [copyStatus, setCopyStatus] = useState('')
  const language = file.name.endsWith('.jsx') ? 'jsx' : 'javascript'
  const highlightedCode = useMemo(
    () => Prism.highlight(file.code, Prism.languages[language], language),
    [file.code, language],
  )

  async function copyFile() {
    try {
      await navigator.clipboard.writeText(file.code)
      setCopyStatus('File copied.')
    } catch {
      setCopyStatus('Could not copy. Select the code and copy it manually.')
    }
  }

  return (
    <>
      <div className="source-toolbar">
        {children}
        <button className="source-button" onClick={copyFile}>
          Copy
        </button>
      </div>
      {file.description && (
        <p className="source-description" id="source-description">
          {file.description}
        </p>
      )}
      <p className="copy-status" role="status">
        {copyStatus}
      </p>
      <pre
        className="source-code"
        tabIndex={0}
        aria-label={`${file.name} source code`}
        aria-describedby={file.description ? 'source-description' : undefined}
      >
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </>
  )
}

export default function ImplementationDrawer({ implementation }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const source = implementationSources[implementation]
  const file = source.files[selectedIndex]

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    closeRef.current.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [isOpen])

  return (
    <div className="implementation-entry" data-nosnippet>
      <button
        ref={triggerRef}
        className="implementation-trigger"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true">&lt;/&gt;</span> View implementation
      </button>
      <dialog
        ref={dialogRef}
        className="implementation-drawer"
        aria-labelledby="implementation-title"
        onCancel={() => setIsOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = dialogRef.current.querySelectorAll(
            'button, select, [tabindex="0"]',
          )
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        <header className="drawer-header">
          <div>
            <p className="drawer-eyebrow">Implementation</p>
            <h2 id="implementation-title">{source.title}</h2>
          </div>
          <button
            ref={closeRef}
            className="source-button drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close implementation"
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>
        {isOpen && (
          <SourceFile key={file.name} file={file}>
            <div className="source-picker">
              {source.files.length > 1 ? (
                <>
                  <label htmlFor="implementation-file">File</label>
                  <select
                    id="implementation-file"
                    value={selectedIndex}
                    onChange={(event) =>
                      setSelectedIndex(Number(event.target.value))
                    }
                  >
                    {source.files.map((entry, index) => (
                      <option key={entry.name} value={index}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <span className="source-filename">{file.name}</span>
              )}
            </div>
          </SourceFile>
        )}
      </dialog>
    </div>
  )
}
