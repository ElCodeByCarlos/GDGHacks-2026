import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const QuizPanel = () => {
  const [question, setQuestion] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Store shuffled answers separately
  const [sessionToken, setSessionToken] = useState('');
  const [category, setCategory] = useState(19);
  const [loading, setLoading] = useState(false);
  
  // Use a Ref to track the last time we called the API (Rate Limit Protection)
  const lastFetchTime = useRef(0);

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get('https://opentdb.com/api_token.php?command=request');
        setSessionToken(res.data.token);
      } catch (err) { console.error("Token Error", err); }
    };
    getToken();
  }, []);

  const fetchQuestion = useCallback(async () => {
    // 5-second Rate Limit Check
    const now = Date.now();
    if (now - lastFetchTime.current < 5000) {
      console.warn("Wait a few seconds before requesting a new question!");
      return;
    }

    if (!sessionToken) return;
    setLoading(true);
    lastFetchTime.current = Date.now();

    try {
      const url = `https://opentdb.com/api.php?amount=1&category=${category}&token=${sessionToken}`;
      const res = await axios.get(url);

      if (res.data.response_code === 0) {
        const q = res.data.results[0];
        setQuestion(q);
        // Shuffle answers ONCE when the question arrives
        setShuffledAnswers(
          [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        );
      } else if (res.data.response_code === 5) {
        alert("Rate limit hit! Wait 5 seconds.");
      } else if (res.data.response_code === 4) {
        alert("Category exhausted! Reloading...");
        window.location.reload();
      }
    } catch (err) {
      console.error("Quiz Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [category, sessionToken]);

  useEffect(() => {
    if (sessionToken) fetchQuestion();
  }, [category, sessionToken, fetchQuestion]);

  return (
    <div className="quiz-container">
      <div className="category-selector">
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="19">Mathematics</option>
          <option value="18">Computers</option>
          <option value="23">History</option>
          <option value="9">General Knowledge</option>
        </select>
      </div>

      {loading ? (
        <p>Loading Question...</p>
      ) : question ? (
        <div className="question-card">
          <h3>{decodeHTML(question.question)}</h3>
          <div className="options-grid">
            {shuffledAnswers.map((opt, i) => (
              <button key={i} className="quiz-opt" onClick={() => {
                if (opt === question.correct_answer) {
                  alert("Correct! 🎉");
                  fetchQuestion(); // Load next
                } else {
                  alert(`Wrong! The answer was: ${decodeHTML(question.correct_answer)}`);
                  fetchQuestion(); // Load next
                }
              }}>
                {decodeHTML(opt)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuizPanel;