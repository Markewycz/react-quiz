import { useEffect, useReducer } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

interface Question {
  question: string;
  options: string[];
  correctOption: number;
  points: number;
}

type State = {
  questions: Question[];
  status: 'ready' | 'error' | 'loading' | 'active' | 'finished';
  index: number;
};

export type Action =
  | {
      type: 'dataReceived';
      payload: Question[];
    }
  | {
      type: 'dataFailed';
    }
  | {
      type: 'unknown';
    }
  | {
      type: 'start';
    };

const initialState: State = {
  questions: [],

  // "loading", "error", "ready", "active", "finished"
  status: 'loading',
  index: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
      };
    default:
      throw new Error('Action unknown');
  }
}

function App() {
  const [{ questions, status, index }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions: number = questions.length;

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(_err => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <MainContent>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && <Question question={questions[index]} />}
      </MainContent>
    </div>
  );
}

export default App;
