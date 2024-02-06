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
    autoGrade: boolean;
    answer?: string;
    choices?: any[];
}

type BaseQuestionForm = {
    question_id: string;
    title: string;
    description?: string;
    autoGrade: boolean;
    choices: any[];
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
    user_id: number;
    created_at: string;
    updated_at: string;
    tags: string[];
    questions: QuestionForm[];
}
