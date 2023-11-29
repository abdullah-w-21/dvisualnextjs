import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {db} from './db'; 

const saltRounds = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, organisationname } = req.body;

  // Generate unique ids using UUID
  const organisation_id = uuidv4();
  const role_id = uuidv4();

  // Set a default value of 'True' for status
  const status = true;

  // Generate a random activation date between now and 30 days in the future
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 30);

  // Generate a random date within the specified range
  const randomDate = new Date(
    currentDate.getTime() + Math.random() * (futureDate.getTime() - currentDate.getTime())
  );

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const data = {
      email,
      password: hash,
      organisationname,
      organisation_id,
      status,
      activedate: randomDate,
    };

    const [ress] = await db.query(`SELECT * FROM users WHERE email='${email}'`);

    if (Array.isArray(ress) && ress.length > 0) {
      return res.status(400).json({ msg: 'User Email Already Present' });
    }

    // Insert into the organizations table
    const organizationSql = 'INSERT INTO organizations (organisation_id, organisationname) VALUES (?, ?)';
    const organizationValues = [organisation_id, organisationname];

    await db.query(organizationSql, organizationValues);

    // Now that the organisation_id and organisationname are inserted, proceed to insert into the users table
    const [result] = await db.query('INSERT INTO users SET ?', data);

    // Now that the user is registered, you can get the user_id
    const user_id = result?.insertId;

    if (!user_id) {
      throw new Error('User ID not found');
    }

    // Set the user_id and organisation_id for the roleData
    const roleData = {
      role_id,
      user_id,
      role: 'user',
    };

    await db.query('INSERT INTO user_roles SET ?', roleData);

    return res.status(200).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}
