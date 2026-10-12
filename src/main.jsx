import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div role="alert">
          <p>Something went wrong with the text editor.</p>
          <p>Restarting will clear your text and undo history.</p>
          <button onClick={resetErrorBoundary}>Restart editor</button>
        </div>
      )}
      onError={(error, info) => {
        console.error(error, info);
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
