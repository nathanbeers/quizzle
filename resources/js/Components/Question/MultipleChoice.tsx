import { UseFormRegister } from 'react-hook-form';
import { FieldWrapper, RadioGroup, Radio } from '@/Components/ui';

interface Choice {
  id: string;
  text: string;
}

interface MultipleChoiceProps {
  choices: Choice[];
  questionIndex: number;
  question: string;
  error: string | undefined;
  register: UseFormRegister<any>;
}

const MultipleChoice = ({ choices, question, questionIndex, error, register }: MultipleChoiceProps) => {
  return (
    <FieldWrapper>
      <RadioGroup
        layout="vertical"
        legend={question}
        error={error}
        required
      >
        {choices.map((choice) => (
          <Radio
            key={choice.id}
            register={register}
            id={`${choice.id}`}
            label={choice.text}
            value={choice.text}
            name={`questions.${questionIndex}.answerChosen`}
            className='mb-2'
            required={true}
          />
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
};

export default MultipleChoice;
