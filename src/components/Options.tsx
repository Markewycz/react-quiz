import { Action, ActionTypes } from './App';

interface OptionsProps {
  question: {
    correctOption: number;
    options: string[];
    points: number;
    question: string;
  };
  dispatch: React.Dispatch<Action>;
  answer: null | number;
}

export default function Options({ question, dispatch, answer }: OptionsProps) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={option}
          disabled={answer !== null}
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${
            hasAnswered
              ? index === question.correctOption
                ? 'correct'
                : 'wrong'
              : ''
          }`}
          onClick={() =>
            dispatch({ type: ActionTypes.NewAnswer, payload: index })
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
