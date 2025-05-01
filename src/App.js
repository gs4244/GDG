import React from 'react';
import QuizAppV4 from './MyQuizAppV4';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Quiz</h1>
      </header>
      <main>
        <QuizAppV4 />
      </main>
      <footer>
        <p>Created by Gavril Seth for GDG</p>
      </footer>
    </div>
  );
}

export default App;