export class DB {
  async getAll() {
    const db_data = await fetch('db.json');
    const db = await db_data.json();
    return db;
  }
}