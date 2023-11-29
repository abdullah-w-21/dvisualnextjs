import mysql from 'mysql';

const dbConfig = {
  host: 'database-1.caoacq3ev5m0.eu-north-1.rds.amazonaws.com',
  user: 'abdullah',
  password: 'abdullah-w-21',
  database: 'dvisual',
};

const pool = mysql.createPool(dbConfig);

// Connection function
const query = (sql: string, values?: any) => {
  return new Promise<any>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, values, (queryError, results) => {
        connection.release();

        if (queryError) {
          reject(queryError);
          return;
        }

        resolve(results);
      });
    });
  });
};

const db = {
  query,
};

export { db };

