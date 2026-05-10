import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const QuizPanel = () => {
  const [question, setQuestion] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [category, setCategory] = useState("19");
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  // 1. FIXED HELPERS (Corrected closing braces)
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // 2. TOKEN FETCH (Runs once on mount)
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get('https://opentdb.com/api_token.php?command=request');
        setSessionToken(res.data.token);
      } catch (err) {
        console.error("Token Error:", err);
      }
    };
    getToken();
  }, []);

  // 3. GEMINI FETCH
  const fetchGeminiQuestion = async () => {
    if (!customTopic) return;
    setLoading(true);
    try {
      const prompt = `Generate one multiple-choice quiz question about ${customTopic}. 
      Provide 1 correct answer and 3 incorrect answers. 
      Return ONLY a raw JSON object. 
      Structure: {"question": "string", "correct_answer": "string", "incorrect_answers": ["string", "string", "string"]}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanText = jsonMatch ? jsonMatch[0] : text;

      const cleanJson = JSON.parse(cleanText);
      setQuestion(cleanJson);
      setShuffledAnswers([...cleanJson.incorrect_answers, cleanJson.correct_answer].sort(() => Math.random() - 0.5));
    } catch (err) {
      console.error("Gemini Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. STANDARD FETCH
  const fetchStandardQuestion = useCallback(async () => {
    if (!sessionToken || category === "custom") return;
    setLoading(true);
    try {
      const res = await axios.get(`https://opentdb.com/api.php?amount=1&category=${category}&token=${sessionToken}`);
      if (res.data.response_code === 0) {
        const q = res.data.results[0];
        setQuestion(q);
        setShuffledAnswers([...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [category, sessionToken]);

  // 5. THE TRIGGER (This makes standard topics load automatically)
  useEffect(() => {
    if (sessionToken && category !== "custom") {
      fetchStandardQuestion();
    }
  }, [category, sessionToken, fetchStandardQuestion]);

  const handleNext = () => {
    if (category === "custom") fetchGeminiQuestion();
    else fetchStandardQuestion();
  };

  return (
    <div className="quiz-container">
      <div className="category-selector">
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="19">Mathematics</option>
          <option value="18">Computers</option>
          <option value="23">History</option>
          <option value="custom">Custom Topic</option>
        </select>

        {category === "custom" && (
          <div className="custom-input-group">
            <input 
              type="text" 
              placeholder="Enter topic..." 
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />
            <button onClick={fetchGeminiQuestion} disabled={loading}>
                {loading ? "Generating..." : "Start AI Quiz"}
            </button>
          </div>
        )}
      </div>

      {loading ? <p>Loading...</p> : question && (
        <div className="question-card">
          <h3>{decodeHTML(question.question)}</h3>
          <div className="options-grid">
            {shuffledAnswers.map((opt, i) => (
              <button key={i} className="quiz-opt" onClick={() => {
                const isCorrect = opt === question.correct_answer;
                alert(isCorrect ? "Correct!" : "Wrong! It was: " + decodeHTML(question.correct_answer));
                handleNext();
              }}>
                {decodeHTML(opt)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPanel;