import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const siteId = req.query.siteId as string;

      // Replace this with your database query to fetch sensor names based on site ID
      const result = await db.query(
        'SELECT sensorname FROM master WHERE site_id = ?',
        [siteId]
      );

      if (result && result.length > 0) {
        const sensorNames = result.map((row: { sensorname: any; }) => row.sensorname);
        return res.status(200).json({ sensorNames });
      } else {
        return res.status(404).json({ error: 'No sensors found for the given site ID' });
      }
    } catch (error) {
      console.error('Error fetching sensor names:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
