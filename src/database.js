import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import os from 'os';

export async function openDb() {
    return open({
        filename: `${os.homedir()}/.config/article/storage.db`,
        driver: sqlite3.Database,
    });
}

