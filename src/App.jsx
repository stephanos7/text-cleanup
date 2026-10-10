import { useReducer } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const initialState = {
  past:[],
  present:"Hello?",
  future:[]
}


// REDUCERS
// They don't need access to anything inside App. React supplies its arguments when passed to useReducer.

// A. basic reducer:
// const textReducer = (_state, value) => {
//   return value;
// };

// B. action-based reducer:
const textReducer = (state, action) => {
  let nextText;
  if (action.type === "TEXT_CHANGED") {
    nextText = action.value;
  }
  if (action.type === "EXTRA_SPACES_REMOVED") {
    nextText = state.present.replace(/[ \t]+/g, " ");
  }
  if (action.type === "BLANK_LINES_REMOVED") {
    nextText = state.present
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .join("\n");
  }

  // Don't record changes that leave the text identical.
  if (nextText === state.present) return state;

   return {
     past: [...state.past, state.present],
     present: nextText,
     future: []
   };
};


function App() {

  // Hooks must run at the top level of a component or custom hook. 
  // we've replaced useState with useReducer
  const [text, dispatch] = useReducer(textReducer, initialState);

  const handleTextChange = (event) => 
    dispatch({type: "TEXT_CHANGED", value: event.target.value});
  ;

  const handleRemoveExtraSpaces = () => 
    dispatch({type: "EXTRA_SPACES_REMOVED"});
  
  const handleRemoveBlankLined = () => 
    dispatch({type:"BLANK_LINES_REMOVED"})


  console.log("text:", text);
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        {/* do things here */}
        <label htmlFor="text-input">Text to clean</label>
        <div
          style={{
            width: "100%",
            padding: 20,
            backgroundColor: "blue",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch"
          }}
        >
          <button onClick={handleRemoveExtraSpaces}>Remove extra spaces</button>
          <button onClick={handleRemoveBlankLined}>Remove blank lines</button>
          <textarea
            id="text-input"
            className="long-text-input"
            // placeholder={"Placeholder goes here..."}
            rows={18}
            value={text.present}
            onChange={handleTextChange}
          />
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App
