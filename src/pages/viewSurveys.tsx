// viewSurveys.tsx
import React, { useEffect, useState } from 'react';
import { Survey } from "@/model";
import GiveSurveyPage from "@/pages/giveSurvey";
import ViewSurveyResultsPage from "@/pages/viewSurveyResults";

const ViewSurveysPage = () => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [showSurveyPage, setShowSurveyPage] = useState(false);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [surveyIndex, setSurveyIndex] = useState(0);

    const handleClick = (index: number) => {
        setShowSurveyPage(true);
        setSurveyIndex(index);
    }
    
    const handleResultsClick = (index: number) => {
        setShowResultsPage(true);
        setSurveyIndex(index);
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/viewSurveys');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.text();
                try {
                    const jsonData = JSON.parse(data);
                    setSurveys(jsonData);
                } catch (e) {
                    console.error("The API response is not valid JSON:", data);
                }
            }
        }
        fetchData().then(r => console.log('Surveys fetched successfully'));
    }, []);
    
    if (showSurveyPage) {
        return <GiveSurveyPage surveys={surveys} index={surveyIndex} />;
    }
    
    if (showResultsPage) {
        return <ViewSurveyResultsPage surveyId={surveys[surveyIndex].id} />;
    }
    
    return (
        <div>
            <h2>Surveys</h2>
            {surveys.map((survey, index) => (
                <div key={index}>
                    {survey.name}
                    <button onClick={() => handleClick(index)}>Take the survey</button>
                    <button onClick={() => handleResultsClick(index)}>View the results</button>
                </div>
            ))}
        </div>
    );
}

export default ViewSurveysPage;
