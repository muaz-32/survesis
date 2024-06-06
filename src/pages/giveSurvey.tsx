// viewSurveys.tsx
import React, { useEffect, useState } from 'react';
import { Survey } from "@/model";

interface GiveSurveyPageProps {
    surveys: Survey[];
    index: number;
}
const GiveSurveyPage: React.FC<GiveSurveyPageProps> = ({surveys, index}) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        // Start the timer
        const timer = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        // Clear the timer when the component unmounts
        return () => clearInterval(timer);
    }, []);
    
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const answers: string[] = [];
        surveys[index].questions.forEach((question, index) => {
            const checkedInputs = Array.from(document.querySelectorAll(`input[name="${question.id}"]:checked`)) as HTMLInputElement[];
            const checkedInput = checkedInputs.find(input => input !== null);
            if (checkedInput) {
                const answer = checkedInput.value;
                answers.push(answer);
            }
        });
        const response = await fetch('/api/submitSurvey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ surveyId: surveys[index].id, answers, time }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Survey submitted successfully' + ' ' + data.message);
        } else {
            alert('Error submitting survey' + ' ' + data.error);
        }
    }
        

    return (
        <div>
            <h2>Survey</h2>
            <h2>{surveys[index].name}</h2>
            <h3>Time: {time}</h3> 
            
            <form onSubmit={handleSubmit}>
                <ol>
                    {surveys[index].questions.map((question, index) => (
                        <li key={index}>
                            <h3>{question.question}</h3>
                            <ul>
                                {question.options.map((option, index) => (
                                    <li key={index}>
                                        <input type="radio" name={question.id.toString()} value={option} required />
                                        <label>{option}</label>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default GiveSurveyPage;

// TODO: handling the state of the radio buttons
