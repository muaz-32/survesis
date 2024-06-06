import {useParams} from "react-router";
import {Survey} from "@/model";
import React from "react";
import {SurveyResults} from "@/model";

interface ViewSurveyResultsPageProps {
    surveyId: number;
}

const ViewSurveyResultsPage: React.FC<ViewSurveyResultsPageProps> = ({surveyId}) => {
    const [surveyResults, setSurveyResults] = React.useState<SurveyResults | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/viewSurveyResults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({surveyId}),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.text();
                try {
                    const jsonData = JSON.parse(data);
                    console.log(jsonData);
                    setSurveyResults(jsonData);
                } catch (e) {
                    console.error("The API response is not valid JSON:", data);
                }
            }
        }
        fetchData().then(r => console.log('Survey results fetched successfully'));
    }, [surveyId]);

    if (!surveyResults) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{surveyResults.name}</h2>
            {surveyResults.questions.map((question, index) => (
                <div key={index}>
                    <h3>{question.question}</h3>
                    <ul>
                        {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                                {option.option} - {option.count}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ViewSurveyResultsPage;
