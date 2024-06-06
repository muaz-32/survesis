// pages/api/createSurvey.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createSurvey } from '@/pages/api/query';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, questions, time } = req.body;
        if (time <= 0) {
            res.status(400).json({ error: 'Time must be greater than 0.' });
            return;
        }
        try {
            await createSurvey(name, questions, time);
            res.status(200).json({ message: 'Survey created successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the survey.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
