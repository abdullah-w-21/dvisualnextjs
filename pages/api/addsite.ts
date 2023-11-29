import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import {db} from './db'; 
import { getSession } from 'next-auth/react'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { site_name, site_location } = req.body;

    // Fetch the logged-in user's data using next-auth
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user?.id;
    const organizationId = session.user?.organisation_id;

    const siteId = uuidv4();

    // Insert the new site into the sites table
    try {
      const result = await db.query(
        `
        INSERT INTO sites (site_id, organisation_id, site_name, site_location)
        VALUES (?, ?, ?, ?)
      `,
        [siteId, organizationId, site_name, site_location]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ success: true, siteId });
      } else {
        console.error('Error adding site:', result.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error adding site:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

