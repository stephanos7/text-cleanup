export default function Logo({ redo = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g transform={redo ? 'translate(24 0) scale(-1 1)' : undefined}>
        <path d="M9 5 4 10l5 5" />
        <path d="M4 10h10a6 6 0 0 1 6 6v3" />
      </g>
    </svg>
  )
}
