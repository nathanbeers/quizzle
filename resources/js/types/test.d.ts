export interface QuestionResponse {
    id: number;
    question_id: string;
    test_id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    title: string;
    type: 'Multiple Choice' | 'Short Answer' | 'True False' | 'Essay';
    description?: string;
    autoGrade: string;
    answer?: string;
    choices?: any[];
}

type BaseQuestionForm = {
    question_id: string;
    title: string;
    description?: string;
    autoGrade: string;
    choices: {id: string, text: string}[];
    trueFalseChoices: {id: string, text: 'True' | 'False'}[];
    saved: boolean;
};

type MultipleChoiceOrTrueFalseQuestionForm = BaseQuestionForm & {
    type: 'Multiple Choice' | 'True False';
    answer: string;
};

type OtherQuestionForm = BaseQuestionForm & {
    type: 'Short Answer' | 'Essay';
    answer?: string;
};

export type QuestionForm = MultipleChoiceOrTrueFalseQuestionForm | OtherQuestionForm;


export interface Test {
    id: number;
    title: string;
    description?: string;
    password?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    close_date: Date;
    tags: string;
    questions: string;
}
