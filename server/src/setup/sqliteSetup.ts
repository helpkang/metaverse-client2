import * as sqlite3 from "sqlite3";

const db = initDatabase();

// db.close((err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

export const sqlitePromise = {
  fetchFirsRow: (query: string, params?: any[]) => {
    return new Promise((resolv, reject) => {
      sqliteEach(query, reject, resolv, params);
    });
  },
  fetchAllRow: (query: string, params: any[]) => {
    return new Promise((resolv, reject) => {
      sqliteFeachAll(query, reject, resolv, params);
    });
  },
  insert: (query: string, ...params: any[]) => {
    return new Promise((resolv, reject) => {
      sqliteInsert(query, reject, resolv, params);
    });
  },
};

function initDatabase() {
  const dbname = "../metaverse-sqlite/metaverse.db";

  const db = new sqlite3.Database(dbname, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the metaverse database.");
  });

  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db
      // .run('drop table user')
      .run(
        `
            CREATE TABLE IF NOT EXISTS user (
                name TEXT,
                cdate TEXT
            )
        `
      );
    // .run(
    //   `
    //         INSERT INTO user (name, cdate) values ('haha', '20211115')
    //         `
    // )
    // .each(`SELECT name, cdate FROM user`, (err, row) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log(row);
    // });
    // db.each(`SELECT PlaylistId as id,
    //                 Name as name
    //          FROM playlists`, (err, row) => {
    //   if (err) {
    //     console.error(err.message);
    //   }
    //   console.log(row.id + "\t" + row.name);
    // });
  });
  return db;
}

function sqliteEach(
  query: string,
  reject: (reason?: any) => void,
  resolv: (value: unknown) => void,
  params: any[]
) {
  db.serialize(() => {
    db.each(
      query,
      params,
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolv(row);
      },
      (err, count) => {
        if (count === 0) resolv(null);
      }
    );
  });
}
function sqliteFeachAll(
  query: string,
  reject: (reason?: any) => void,
  resolv: (value: unknown) => void,
  params: any[]
) {
  db.all(
    query,
    params,
    (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolv(rows);
    }
  );
}
function sqliteInsert(
  query: string,
  reject: (reason?: any) => void,
  resolv: (value: unknown) => void,
  params: any[]
) {
  db.serialize(() => {
    db.run(query, ...params, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolv(result);
    });
  });
}
