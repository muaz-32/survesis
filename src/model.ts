export interface Question {
    id: number;
    question: string;
    options: string[];
    surveyId: number;
}

export interface Survey {
    id: number;
    name: string;
    questions: Question[];
}

export interface SurveyResults {
    name: string;
    questions: {
        question: string;
        options: {
            option: string;
            count: number;
        }[];
    }[];
}
