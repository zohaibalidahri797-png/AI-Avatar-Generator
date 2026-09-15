'use client';

/**
 * "My Avatars" — a private, browser-only avatar collection.
 *
 * Saved avatars live exclusively in this browser's IndexedDB. Nothing is
 * uploaded to a server, and clearing site data removes everything.
 */

export interface SavedAvatar {
  id: string;
  /** Framed, ready-to-use PNG data URL shown in the collection grid. */
  dataUrl: string;
  /** Raw (unframed) generated image, kept so the avatar can be re-edited. */
  rawUrl: string;
  styleGroupLabel: string;
  substyle: string;
  framing: string;
  createdAt: number; // epoch ms
  /**
   * Manual sort key (larger = higher in the grid). Optional so entries saved
   * before reordering existed stay readable; they fall back to createdAt.
   */
  sortOrder?: number;
}

const DB_NAME = 'avatarforge';
const DB_VERSION = 1;
const STORE = 'avatars';
/** Keep the collection bounded so it never eats unbounded disk space. */
export const MAX_COLLECTION = 24;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexeddb-unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(new Error('indexeddb-open-failed'));
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const tx = database.transaction(STORE, mode);
        const req = run(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(new Error('indexeddb-request-failed'));
        tx.oncomplete = () => database.close();
      })
  );
}

export async function getCollection(): Promise<SavedAvatar[]> {
  try {
    const all = await withStore<SavedAvatar[]>('readonly', (store) => store.getAll() as IDBRequest<SavedAvatar[]>);
    // Manual order wins; entries without one keep the newest-first default.
    return all.sort(
      (a, b) => (b.sortOrder ?? b.createdAt) - (a.sortOrder ?? a.createdAt)
    );
  } catch {
    return [];
  }
}

export async function saveToCollection(entry: SavedAvatar): Promise<void> {
  const database = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    // Evict oldest entries beyond the cap, then insert the new one.
    const countReq = store.count();
    countReq.onsuccess = () => {
      const overflow = countReq.result + 1 - MAX_COLLECTION;
      if (overflow > 0) {
        const cursorReq = store.openCursor();
        let toDelete = overflow;
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (!cursor || toDelete <= 0) {
            store.put(entry);
            return;
          }
          store.delete(cursor.primaryKey);
          toDelete -= 1;
          cursor.continue();
        };
        cursorReq.onerror = () => reject(new Error('indexeddb-evict-failed'));
      } else {
        store.put(entry);
      }
    };
    countReq.onerror = () => reject(new Error('indexeddb-count-failed'));
    tx.oncomplete = () => {
      database.close();
      resolve();
    };
    tx.onerror = () => reject(new Error('indexeddb-save-failed'));
  });
}

/**
 * Persist a manual display order (top-to-bottom as given).
 * Every id in the list gets a fresh sortOrder so the grid matches exactly.
 */
export async function reorderCollection(orderedIds: string[]): Promise<void> {
  const database = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const base = Date.now();
    orderedIds.forEach((id, index) => {
      const req = store.get(id);
      req.onsuccess = () => {
        const entry = req.result as SavedAvatar | undefined;
        if (entry) {
          store.put({ ...entry, sortOrder: base - index });
        }
      };
    });
    tx.oncomplete = () => {
      database.close();
      resolve();
    };
    tx.onerror = () => reject(new Error('indexeddb-reorder-failed'));
  });
}

export async function removeFromCollection(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id) as unknown as IDBRequest<undefined>);
}

export async function clearCollection(): Promise<void> {
  await withStore('readwrite', (store) => store.clear() as unknown as IDBRequest<undefined>);
}
