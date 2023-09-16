import { useEffect, useReducer } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';

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
  answer: null;
  points: number;
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
    }
  | {
      type: 'newAnswer';
      payload: null;
    }
  | {
      type: 'nextQuestion';
    };

const initialState: State = {
  questions: [],

  // "loading", "error", "ready", "active", "finished"
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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
    case 'newAnswer':
      // eslint-disable-next-line no-case-declarations
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    default:
      throw new Error('Action unknown');
  }
}

function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions: number = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </MainContent>
    </div>
  );
}

export default App;
