import { getDb } from "@/db";
import {Question, Survey, SurveyResults} from "@/model";
import viewSurveys from "@/pages/viewSurveys";

const db = getDb();

export const createSurvey = async (surveyName: string, questions: Question[], time: number) => {
    try {
        const surveyData = await db.one('insert into surveys(name, time) values($1, $2) returning id', [surveyName, time]);
        const surveyId = surveyData.id;
        for (const question of questions) {
            const questionData = await db.one('insert into questions(question, survey_id) values($1, $2) returning id', [question.question, surveyId]);
            const questionId = questionData.id;
            for (const option of question.options) {
                await db.none('insert into options(value, question_id) values($1, $2)', [option, questionId]);
            }
        }
    }
    catch (error) {
        console.error('Error creating survey:', error);
        throw error;
    }
}

export const getSurveys = async () => {
    const surveysData = await db.any('select * from surveys');
    let surveys: Survey[] = [];
    surveysData.forEach((row: any) => {
        const newSurvey: Survey = {
            id: row.id,
            name: row.name,
            questions: []
        };
        surveys.push(newSurvey);
    });
    
    const questionsData = await db.any('select * from questions');
    for (const row of questionsData) {
        const newQuestion: Question = {
            id: row.id,
            question: row.question,
            options: [],
            surveyId: row.survey_id
        };

        const optionsData = await db.any('select * from options where question_id = $1', [row.id]);
        optionsData.forEach((row: any) => {
            newQuestion.options.push(row.value);
        });
        
        surveys.find(survey => survey.id === newQuestion.surveyId)?.questions.push(newQuestion);
    }
    
    return surveys;
}

export const submitSurvey = async (surveyId: number, answers: string[], time: number) => {
    const maxTime = await db.one('select time from surveys where id = $1', [surveyId]);
    if (time > maxTime.time) {
        return;
    }
    try {
        const questionIds = await db.any('select id from questions where survey_id = $1', [surveyId]);
        for (let i = 0; i < questionIds.length; i++) {
            await db.none('insert into responses(question_id, value) values($1, $2)', [questionIds[i].id, answers[i]]);
        }
    }
    catch (error) {
        console.error('Error submitting survey:', error);
        throw error;
    }
}

export const viewSurveyResults = async (surveyId: number) => {
    const questionsData = await db.any('select id from questions where survey_id = $1', [surveyId]);
    let results: SurveyResults = {name: '', questions: []};
    for (const question of questionsData) {
        const questionData = await db.one('select question from questions where id = $1', [question.id]);
        const questionResults = {question: questionData.question, options: [{option: '', count: 0}]};
        const optionsData = await db.any('select value from options where question_id = $1', [question.id]);
        for (const option of optionsData) {
            const optionData = await db.one('select count(*) from responses where question_id = $1 and value = $2', [question.id, option.value]);
            questionResults.options.push({option: option.value, count: optionData.count});
        }
        questionResults.options.shift();
        results.questions.push(questionResults);
    }
    const surveyData = await db.one('select name from surveys where id = $1', [surveyId]);
    results.name = surveyData.name;
    return results;
}
