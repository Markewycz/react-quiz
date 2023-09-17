import { Action, ActionTypes } from './App';

type NextButtonProps = {
  dispatch: React.Dispatch<Action>;
  answer: null | number;
  index: number;
  numQuestions: number;
};

export default function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
}: NextButtonProps) {
  if (answer === null) return;
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: ActionTypes.NextQuestion })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: ActionTypes.Finish })}
      >
        Finish
      </button>
    );
}
