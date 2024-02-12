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
  register: UseFormRegister<any>;
}

const MultipleChoice = ({ choices, question, questionIndex, register }: MultipleChoiceProps) => {
  return (
    <FieldWrapper>
      <RadioGroup
        layout="vertical"
        legend={question}
        required
      >
        {choices.map((choice) => (
          <Radio
            key={choice.id}
            register={register}
            id={`${choice.id}`}
            label={choice.text}
            value={choice.text}
            name={`questions.${questionIndex}.answer`}
            className='mb-2'
            required={true}
          />
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
};

export default MultipleChoice;
