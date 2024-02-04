export interface Question {
    id: number;
    title: string;
    description?: string;
    test_id: number;
    created_at: string;
    updated_at: string;
    answer?: string | number;
}

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
