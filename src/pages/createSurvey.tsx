import React, { useState } from 'react';
import { Question } from "@/model";

export default function CreateSurveyPage() {
    const [name, setName] = useState('');
    const [time, setTime] = useState<number>(0);
    const [questions, setQuestions] = useState<Question[]>([]);

    const handleAddQuestion = () => {
        const newQuestion: Question = { id: 0, question: '', options: ['', ''], surveyId: 0 };
        setQuestions([...questions, newQuestion]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newQuestions: Question[] = questions.map((question, i) => i === index ? { ...question, question: e.target.value } : question);
        setQuestions(newQuestions);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => {
        const newQuestion: Question[] = questions.map((question, i) => i === questionIndex ? { ...question, options: question.options.map((option, j) => j === optionIndex ? e.target.value : option) } : question);
        setQuestions(newQuestion);
    };

    const handleAddOption = (questionIndex: number) => {
        const newQuestions: Question[] = questions.map((question, i) => i === questionIndex ? { ...question, options: [...question.options, ''] } : question);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const survey = { name, questions, time };
        const response = await fetch('/api/createSurvey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(survey),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Survey created successfully' + ' ' + data.message);
        } else {
            alert('Error creating survey' + ' ' + data.error);
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Survey Name" required />
            <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} placeholder="Max Survey Time" required/>
            {questions.map((question, index) => (
                <div key={index}>
                    <input type="text" value={question.question} onChange={(e) => handleQuestionChange(e, index)}
                           placeholder="Question" required/>
                    {question.options.map((option, optionIndex) => (
                        <input key={optionIndex} type="text" value={option}
                               onChange={(e) => handleOptionChange(e, index, optionIndex)}
                               placeholder={`Option ${optionIndex + 1}`} required/>
                    ))}
                    <button type="button" onClick={() => handleAddOption(index)}>Add Option</button>
                    <button type="button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
                </div>
            ))}
            <button type="button" onClick={handleAddQuestion}>Add Question</button>
            <button type="submit">Create Survey</button>
        </form>
        </div>
    );
}
