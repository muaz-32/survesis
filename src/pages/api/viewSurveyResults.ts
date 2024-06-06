import {NextApiRequest, NextApiResponse} from "next";
import {viewSurveyResults} from "@/pages/api/query";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {surveyId} = req.body
        try {
            const surveyResults = await viewSurveyResults(surveyId);
            res.status(200).json(surveyResults);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching the survey results'});
        }
    } else {
        res.status(405).json({error: 'Method not allowed.'});
    }
}
