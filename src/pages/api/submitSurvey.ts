import { NextApiRequest, NextApiResponse } from "next";
import {submitSurvey} from "@/pages/api/query";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { surveyId, answers, time } = req.body;
        try {
            await submitSurvey(surveyId, answers, time);
            res.status(200).json({ message: 'Survey submitted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while submitting the survey.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
