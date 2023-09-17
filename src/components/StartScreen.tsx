import { Action, ActionTypes } from './App';

interface StartScreenProps {
  numQuestions: number;
  dispatch: React.Dispatch<Action>;
}

export default function StartScreen({
  numQuestions,
  dispatch,
}: StartScreenProps) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: ActionTypes.Start })}
      >
        Let's start
      </button>
    </div>
  );
}
