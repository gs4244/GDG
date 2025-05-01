import React, { useState, useEffect } from 'react';
import './QuizStyleV4.css';

// Quiz data - array of question objects
const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    category: "Geography"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
    category: "Astronomy"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    category: "Art"
  },
  {
    id: 4,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    category: "Chemistry"
  },
  {
    id: 5,
    question: "Which ocean is the largest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
    category: "Geography"
  }
];

const QuizAppV4 = () => {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [animation, setAnimation] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (!showFeedback && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback, quizCompleted]);
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (selectedAnswer === "") return; // Don't proceed if no answer selected
    
    // Check if answer is correct and update score
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setAnimation("correct");
    } else {
      setAnimation("incorrect");
    }
    
    setAnsweredQuestions([...answeredQuestions, {
      questionId: currentQuestion,
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer === quizData[currentQuestion].correctAnswer,
      timeTaken: 30 - timeLeft
    }]);
    
    setShowFeedback(true);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    // Check if we have more questions
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      setTimeLeft(30);
      setAnimation("");
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(30);
    setAnimation("");
    setAnsweredQuestions([]);
  };

  // Calculate percentage score
  const calculatePercentage = () => {
    return Math.round((score / quizData.length) * 100);
  };

  // Get feedback text based on final score
  const getFeedbackText = () => {
    const percentage = calculatePercentage();
    
    if (percentage >= 80) return "Excellent! You're a quiz master!";
    if (percentage >= 60) return "Good job! You know your stuff!";
    if (percentage >= 40) return "Not bad! Room for improvement.";
    return "Keep learning! You'll do better next time.";
  };
  
  // Get badge based on score
  const getScoreBadge = () => {
    const percentage = calculatePercentage();
    
    if (percentage >= 80) return "gold";
    if (percentage >= 60) return "silver";
    if (percentage >= 40) return "bronze";
    return "participant";
  };

  // Render quiz completion screen
  if (quizCompleted) {
    return (
      <div className="quiz-container-v4 quiz-results">
        <div className="award-badge"></div>
        
        <h1 className="results-title">Quiz Completed!</h1>
        <p className="results-subtitle">You've finished the knowledge challenge</p>
        
        <div className="results-card">
          <div className="score-display">
            <div className={`score-percentage ${
              calculatePercentage() >= 80 ? 'high-score' : 
              calculatePercentage() >= 60 ? 'good-score' : 
              calculatePercentage() >= 40 ? 'medium-score' : 'low-score'
            }`}>
              {calculatePercentage()}%
            </div>
            <div className="score-info">
              <p>Your Score</p>
              <p className="score-fraction">{score} / {quizData.length}</p>
            </div>
          </div>
          
          <div className="feedback-message">
            <p>{getFeedbackText()}</p>
          </div>
          
          {/* Performance summary */}
          <div className="performance-summary">
            <h3 className="summary-title">Performance Summary</h3>
            <div className="answers-list">
              {answeredQuestions.map((item, index) => (
                <div key={index} className={`answer-item ${item.isCorrect ? 'answer-correct' : 'answer-wrong'}`}>
                  <span>Question {index + 1}</span>
                  <span className="time-taken">{item.timeTaken}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleRestartQuiz}
          className="restart-button"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  // Render current question
  return (
    <div className={`quiz-container-v4 ${animation === "correct" ? "animate-correct" : animation === "incorrect" ? "animate-incorrect" : ""}`}>
      {/* Category badge */}
      <div className="category-badge">
        {quizData[currentQuestion].category}
      </div>
      
      {/* Timer */}
      <div className="timer-container">
        <div className={`timer-value ${timeLeft <= 5 ? 'timer-low' : timeLeft <= 10 ? 'timer-warning' : 'timer-normal'}`}>
          {timeLeft}
        </div>
        <div className="timer-bar">
          <div 
            className={`timer-progress ${timeLeft <= 5 ? 'timer-low' : timeLeft <= 10 ? 'timer-warning' : 'timer-normal'}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="progress-section">
        <div className="progress-header">
          <p className="question-count">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
          <p className="current-score">
            Score: {score}
          </p>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h2 className="question-text">{quizData[currentQuestion].question}</h2>

      {/* Answer options */}
      <div className="options-container">
        {quizData[currentQuestion].options.map((option, index) => (
          <div 
            key={index}
            onClick={() => !showFeedback && handleOptionSelect(option)}
            className={`option-item ${
              showFeedback && option === quizData[currentQuestion].correctAnswer
                ? 'option-correct'
                : showFeedback && selectedAnswer === option && selectedAnswer !== quizData[currentQuestion].correctAnswer
                ? 'option-incorrect'
                : selectedAnswer === option 
                ? 'option-selected' 
                : ''
            }`}
          >
            <div className="option-letter">
              {['A', 'B', 'C', 'D'][index]}
            </div>
            <span className="option-text">{option}</span>
            
            {showFeedback && option === quizData[currentQuestion].correctAnswer && (
              <span className="option-icon correct-icon">✓</span>
            )}
            {showFeedback && selectedAnswer === option && selectedAnswer !== quizData[currentQuestion].correctAnswer && (
              <span className="option-icon incorrect-icon">✗</span>
            )}
          </div>
        ))}
      </div>

      {/* Feedback section (shown after submission) */}
      {showFeedback && (
        <div className={`feedback-box ${
          selectedAnswer === quizData[currentQuestion].correctAnswer
            ? 'feedback-correct'
            : 'feedback-incorrect'
        }`}>
          {selectedAnswer === quizData[currentQuestion].correctAnswer
            ? (
              <div className="feedback-content">
                <span className="feedback-icon correct-icon">✓</span>
                <div>
                  <p className="feedback-title">Correct!</p>
                  <p className="feedback-subtitle">Well done, that's the right answer!</p>
                </div>
              </div>
            )
            : (
              <div className="feedback-content">
                <span className="feedback-icon incorrect-icon">✗</span>
                <div>
                  <p className="feedback-title">Incorrect</p>
                  <p className="feedback-subtitle">The correct answer is: {quizData[currentQuestion].correctAnswer}</p>
                </div>
              </div>
            )
          }
        </div>
      )}

      {/* Action buttons */}
      <div className="button-container">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === ""}
            className={`submit-button ${selectedAnswer === "" ? 'button-disabled' : ''}`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="next-button"
          >
            {currentQuestion < quizData.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
      
      {/* Footer icon */}
      <div className="quiz-footer">
        <div className="book-icon">📚</div>
      </div>
    </div>
  );
};

export default QuizAppV4;