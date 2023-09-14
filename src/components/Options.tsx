interface OptionsProps {
  question: {
    correctOption: number;
    options: string[];
    points: number;
    question: string;
  };
}

export default function Options({ question }: OptionsProps) {
  return (
    <div className="options">
      {question.options.map(option => (
        <button key={option} className="btn btn-option">
          {option}
        </button>
      ))}
    </div>
  );
}
