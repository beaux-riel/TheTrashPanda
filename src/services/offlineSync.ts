import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabaseClient';

// Open SQLite database
const db = SQLite.openDatabase('harvestlink.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Create tables for offline data
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_farms (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_updated INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_products (
            id TEXT PRIMARY KEY,
            farm_id TEXT NOT NULL,
            data TEXT NOT NULL,
            last_updated INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_orders (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            synced INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name TEXT NOT NULL,
            record_id TEXT NOT NULL,
            operation TEXT NOT NULL,
            data TEXT,
            created_at INTEGER NOT NULL
          );`
        );
      },
      (error) => {
        console.error('Error initializing database:', error);
        reject(error);
      },
      () => {
        resolve(true);
      }
    );
  });
};

// Cache data for offline use
export const cacheData = async (tableName: string, id: string, data: any) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const jsonData = JSON.stringify(data);
    
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO offline_${tableName} (id, data, last_updated) 
           VALUES (?, ?, ?)`,
          [id, jsonData, timestamp],
          (_, result) => {
            resolve(result);
          }
        );
      },
      (error) => {
        console.error(`Error caching ${tableName} data:`, error);
        reject(error);
      }
    );
  });
};

// Get cached data
export const getCachedData = async (tableName: string, id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT data FROM offline_${tableName} WHERE id = ?`,
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(JSON.parse(rows.item(0).data));
            } else {
              resolve(null);
            }
          }
        );
      },
      (error) => {
        console.error(`Error getting cached ${tableName} data:`, error);
        reject(error);
      }
    );
  });
};

// Queue operations for sync
export const queueForSync = async (
  tableName: string,
  recordId: string,
  operation: 'INSERT' | 'UPDATE' | 'DELETE',
  data?: any
) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const jsonData = data ? JSON.stringify(data) : null;
    
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO sync_queue (table_name, record_id, operation, data, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [tableName, recordId, operation, jsonData, timestamp],
          (_, result) => {
            resolve(result);
          }
        );
      },
      (error) => {
        console.error('Error queuing operation for sync:', error);
        reject(error);
      }
    );
  });
};

// Sync queued operations when online
export const syncQueuedOperations = async () => {
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    console.log('No internet connection, skipping sync');
    return 0;
  }
  
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM sync_queue ORDER BY created_at ASC`,
          [],
          async (_, { rows }) => {
            const operations = rows._array;
            let syncedCount = 0;
            
            for (const op of operations) {
              try {
                await processOperation(op);
                
                // Remove from queue after successful sync
                tx.executeSql(
                  `DELETE FROM sync_queue WHERE id = ?`,
                  [op.id]
                );
                
                syncedCount++;
              } catch (error) {
                console.error('Error processing operation:', error);
                // Keep in queue to retry later
              }
            }
            
            resolve(syncedCount);
          }
        );
      },
      (error) => {
        console.error('Error syncing queued operations:', error);
        reject(error);
      }
    );
  });
};

// Process a single operation
const processOperation = async (operation: any) => {
  const { table_name, record_id, operation: op, data } = operation;
  const parsedData = data ? JSON.parse(data) : null;
  
  switch (op) {
    case 'INSERT':
      await supabase.from(table_name).insert(parsedData);
      break;
    case 'UPDATE':
      await supabase.from(table_name).update(parsedData).eq('id', record_id);
      break;
    case 'DELETE':
      await supabase.from(table_name).delete().eq('id', record_id);
      break;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
};

// Listen for network changes and sync when online
export const setupNetworkListener = () => {
  return NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      console.log('Connected to the internet, syncing data...');
      syncQueuedOperations()
        .then((count) => {
          console.log(`Synced ${count} operations`);
        })
        .catch((error) => {
          console.error('Error during sync:', error);
        });
    }
  });
};