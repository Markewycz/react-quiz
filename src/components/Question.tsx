import Options from './Options';

export interface QuestionProps {
  question: {
    correctOption: number;
    options: string[];
    points: number;
    question: string;
  };
}

export default function Question({
  question,
  dispatch,
  answer,
}: QuestionProps) {
  return (
    <div>
      <h4>{question.question}</h4>

      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}
