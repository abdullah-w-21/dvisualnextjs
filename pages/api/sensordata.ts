import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sensorName = req.query.sensorName as string;
    const siteId = req.query.siteId as string;

    try {
      // Fetch sensor_id from the master table based on sensorname and site_id
      const sensorIdResult = await db.query(
        'SELECT sensorid FROM master WHERE sensorname = ? AND site_id = ?',
        [sensorName, siteId]
      );

      if (sensorIdResult.length === 0) {
        return res.status(404).json({ error: 'Sensor not found' });
      }

      const sensorId = sensorIdResult[0].sensorid;

      // Fetch data from the transactions table based on the obtained sensor_id
      const sensorDataResult = await db.query(
        'SELECT date, time, reading FROM transactions WHERE sensor_id = ?',
        [sensorId]
      );

      // Transform the data if needed
      const sensorData = sensorDataResult.map((row: { date: any; time: any; reading: any; }) => ({
        date: row.date,
        time: row.time,
        reading: row.reading,
      }));

      return res.status(200).json({ sensorData });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

