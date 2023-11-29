import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, signOut } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      // User is not authenticated
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await signOut(); // Destroy the session

    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Logout failed' });
  }
}

