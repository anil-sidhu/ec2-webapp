import { useState } from "react";
import "./App.css";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export default function App() {
  const [model, setModel] = useState("gemma4:e2b");
  const [prompt, setPrompt] = useState("Explain React hooks in simple words.");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function askOllama(event) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }

    setAnswer("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.response || "Ollama returned an empty response.");
    } catch (err) {
      setError(
        `${err.message}. Make sure Ollama is running and the model is installed.`,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Local AI demo</p>
        <h1>Simple Ollama UI</h1>
        <p className="intro">
          Ask a local Ollama model a question from this React app. Start Ollama,
          choose a model, then send a prompt.
        </p>

        <form className="prompt-form" onSubmit={askOllama}>
          <label htmlFor="model">Model name</label>
          <input
            id="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="llama3.2"
          />

          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows="6"
            placeholder="Ask Ollama something..."
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Ask Ollama"}
          </button>
        </form>

        <div className="help-box">
          <strong>Before testing:</strong>
          <code>ollama serve</code>
          <code>ollama pull {model || "llama3.2"}</code>
        </div>

        {error && <p className="error-message">{error}</p>}

        <section className="answer-card" aria-live="polite">
          <h2>Response</h2>
          <p>{answer || "The model response will appear here."}</p>
        </section>
      </section>
    </main>
  );
}