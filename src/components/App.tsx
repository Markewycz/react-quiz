import { useEffect, useReducer } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Loader from './Loader';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Timer from './Timer';
import Footer from './Footer';
import ErrorMsg from './ErrorMsg';

const SECS_PER_QUESTION = 30;

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
  answer: number | null;
  points: number;
  highscore: number;
  secondsRemaining: number;
};

export enum ActionTypes {
  DataReceived = 'dataReceived',
  DataFailed = 'dataFailed',
  Start = 'start',
  NewAnswer = 'newAnswer',
  NextQuestion = 'nextQuestion',
  Finish = 'finish',
  Restart = 'restart',
  Tick = 'tick',
}

export type Action =
  | { type: ActionTypes.DataReceived; payload: Question[] }
  | { type: ActionTypes.DataFailed }
  | { type: ActionTypes.Start }
  | { type: ActionTypes.NewAnswer; payload: number }
  | { type: ActionTypes.NextQuestion }
  | { type: ActionTypes.Finish }
  | { type: ActionTypes.Restart }
  | { type: ActionTypes.Tick };

const initialState: State = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 0,
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer': {
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question?.correctOption
            ? state.points + question?.points
            : state.points,
      };
    }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...state,
        ...initialState,
        questions: state.questions,
        status: 'ready',

        // index: 0,
        // answer: null,
        // points: 0,
        // secondsRemaining: 10,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining && state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions: number = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: ActionTypes.DataReceived, payload: data }))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(_err => dispatch({ type: ActionTypes.DataFailed }));
  }, []);

  return (
    <div className="app">
      <Header />
      <MainContent>
        {status === 'loading' && <Loader />}
        {status === 'error' && <ErrorMsg />}
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
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </MainContent>
    </div>
  );
}

export default App;
