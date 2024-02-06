export interface QuestionResponse {
    id: number;
    question_id: string;
    test_id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    title: string;
    type: 'multipleChoice' | 'shortAnswer' | 'trueFalse' | 'essay';
    description?: string;
    autoGrade: boolean;
    answer?: string | number | [];
}

type BaseQuestionForm = {
    question_id: string;
    title: string;
    description?: string;
    autoGrade: boolean;
};

type MultipleChoiceOrTrueFalseQuestionForm = BaseQuestionForm & {
    type: 'multipleChoice' | 'trueFalse';
    answer: string[];
};

type OtherQuestionForm = BaseQuestionForm & {
    type: 'shortAnswer' | 'essay';
    answer?: string;
};

export type QuestionForm = MultipleChoiceOrTrueFalseQuestionForm | OtherQuestionForm;


export interface Test {
    id: number;
    title: string;
    description?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    tags: string[];
    questions: Question[];
}
