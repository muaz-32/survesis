import { NextApiRequest, NextApiResponse } from 'next';
import { getSurveys } from '@/pages/api/query';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const surveys = await getSurveys();
            res.status(200).json(surveys);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the surveys' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
