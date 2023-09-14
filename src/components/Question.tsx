import Options from './Options';

export interface QuestionProps {
  question: {
    correctOption: number;
    options: string[];
    points: number;
    question: string;
  };
}

export default function Question({ question }: QuestionProps) {
  return (
    <div>
      <h4>{question.question}</h4>

      <Options question={question} />
    </div>
  );
}
