import { initializeApp, FirebaseApp } from 'firebase/app';
import { collection, getDocs, getFirestore, addDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { TTask } from './types';
import { getAuth } from 'firebase/auth';

export let firebaseApp: FirebaseApp;

export const initializeAPI = (): FirebaseApp => {
  firebaseApp = initializeApp({
    apiKey: 'AIzaSyDrfSUAQ-Z55mPTUvAPQ2kutWfXHFln1gA',
    authDomain: 'todo-app-a088b.firebaseapp.com',
    projectId: 'todo-app-a088b',
    storageBucket: 'todo-app-a088b.appspot.com',
    messagingSenderId: '329918426809',
    appId: '1:329918426809:web:7a8243aa44240fb4b57568',
  });

  getAuth(firebaseApp);
  getFirestore(firebaseApp);
  getStorage(firebaseApp);
  return firebaseApp;
};

const usersCollection = 'users';
const userTasksCollection = 'tasks';

export const getTasks = async (uid: string): Promise<TTask[]> => {
  const db = getFirestore();
  const articles: TTask[] = [];

  try {
    const docRef = doc(db, usersCollection, uid);
    const queryItems = query(
      collection(docRef, userTasksCollection),
      where('isRemoved', '==', false),
      orderBy('created', 'asc')
    );
    const querySnapshot = await getDocs(queryItems);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<TTask, 'id' | 'viewMode'>;

      articles.push({
        id: doc.id,
        viewMode: true,
        ...data,
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return articles;
};

export const createTask = async (uid: string, data: Omit<TTask, 'id' | 'created' | 'viewMode'>): Promise<any> => {
  const db = getFirestore();

  try {
    const docRef = doc(db, usersCollection, uid);
    return await addDoc(collection(docRef, userTasksCollection), data).then((docRef) => docRef.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateTask = async (uid: string, id: string, data: Partial<TTask>): Promise<any> => {
  const db = getFirestore();
  const ref = doc(db, usersCollection, uid, userTasksCollection, id);

  try {
    await updateDoc(ref, data);
  } catch (error) {
    return Promise.reject(error);
  }
};
