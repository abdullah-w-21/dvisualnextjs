import { NextApiRequest, NextApiResponse } from 'next';
import {db} from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.userId as string;

    try {
      const result = await db.query(
        `
        SELECT o.organisationname
        FROM users u
        JOIN organizations o ON u.organisation_id = o.organisation_id
        WHERE u.id = ?
      `,
        [userId]
      );

      if (result.length > 0) {
        const organizationname = result[0].organisationname;
        res.status(200).json({ organizationname });
      } else {
        res.status(404).json({ error: 'Organization not found' });
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
