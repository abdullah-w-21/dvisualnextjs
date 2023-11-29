import { NextApiRequest, NextApiResponse } from 'next';
import {db} from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const organizationId = req.query.organizationId as string;

    // Replace this with your database query to fetch sites based on organization ID
    try {
      const result = await db.query(
        `
        SELECT * FROM sites WHERE organisation_id = ?
      `,
        [organizationId]
      );

      return res.status(200).json({ sites: result });
    } catch (error) {
      console.error('Error fetching sites:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

