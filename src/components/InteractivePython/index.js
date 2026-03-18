import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import styles from './styles.module.css';

export default function InteractivePython({ children }) {
  const initialCode = children.props.children.trim();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isSkulptReady, setIsSkulptReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Sequential loading to prevent "Sk is not defined"
    async function initSkulpt() {
      try {
        if (!window.Sk) {
          await loadScript("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js");
          await loadScript("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js");
        }
        setIsSkulptReady(true);
      } catch (err) {
        console.error("Failed to load Skulpt scripts", err);
      }
    }

    initSkulpt();
  }, []);

  const runCode = () => {
    if (!isSkulptReady || !window.Sk) {
        setOutput("Engine is still loading...");
        return;
    }

    setOutput("");
    setIsRunning(true);

    window.Sk.configure({
        output: (text) => setOutput((prev) => prev + text),
        read: (x) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles["files"][x];
        },
        // Adding yieldLimit helps prevent the browser from freezing on infinite loops
        yieldLimit: 100, 
        execLimit: 5000, // 5 second timeout safety
        inputfun: (prompt) => window.prompt(prompt),
        inputfunTakesPrompt: true,
    });

    try {
        // We execute the code
        const result = window.Sk.importMainWithBody("<stdin>", false, code, true);

        // Skulpt returns a 'suspension' or a promise-like object. 
        // We use Promise.resolve to normalize it so .then() always works.
        Promise.resolve(result).then(
        () => {
            setIsRunning(false);
            console.log("Execution complete.");
        },
        (err) => {
            setOutput((prev) => prev + "\n" + err.toString());
            setIsRunning(false);
        }
        );
    } catch (e) {
        setOutput(e.toString());
        setIsRunning(false);
    }
    };

  return (
    <div className={styles.wrapper}>
      <div className={styles.codeHeader}>
        Python Ledger Editor {isSkulptReady ? "✅ Ready" : "⏳ Loading..."}
      </div>
      
      <CodeMirror
        value={code}
        theme={oneDark}
        extensions={[python()]}
        onChange={(value) => setCode(value)}
      />
      
      <button 
        className={styles.runButton} 
        onClick={runCode} 
        disabled={!isSkulptReady}
      >
        {isSkulptReady ? "▶ Run Code" : "Loading Engine..."}
      </button>

      {output && (
        <div className={styles.console}>
          <pre className={styles.output}>{output}</pre>
        </div>
      )}
    </div>
  );
}