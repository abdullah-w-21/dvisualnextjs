import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import {db} from './db';
import { getSession, signIn } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const [result] = await db.query(`SELECT * FROM users WHERE email='${email}'`);

    if (Array.isArray(result) && result.length > 0) {
      const isPasswordValid = await bcrypt.compare(password, result[0].password);

      if (isPasswordValid) {
        // Get the session or initialize it
        const session = await getSession({ req }) ?? {};

        // Set user data in session
        session.user = { id: result[0].id, email: result[0].email };

        // Sign in the user
        await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        return res.status(200).json({ login: true, useremail: email, token: session.accessToken });
      } else {
        return res.status(401).json({ login: false, msg: 'Wrong Password' });
      }
    } else {
      return res.status(401).json({ login: false, msg: 'User Email Not Exists' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}
