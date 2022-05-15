import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TTask } from './reducer';
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

const partnersPostsCollection = 'users';

export const getTasks = async (): Promise<TTask[]> => {
  const db = getFirestore();
  const articles: TTask[] = [];

  try {
    // let snapshot = await db.firestore()
    //   .collection('users')
    //   .doc('XM4fZRhsvEb03dLChcFasi9TctF2')
    //   .collection('tasks')
    //   .get()
    //
    // snapshot.forEach(doc =>{
    //   console.log('hello', doc.data())
    // })

    // const querySnapshotCol = await getDocs(collection(db, partnersPostsCollection));
    // const querySnapshotUser = await getDoc(doc(querySnapshotCol, 'XM4fZRhsvEb03dLChcFasi9TctF2'));
    // const querySnapshot = await getDoc(doc(querySnapshotUser, 'XM4fZRhsvEb03dLChcFasi9TctF2'));

    const docRef = doc(db, partnersPostsCollection, 'XM4fZRhsvEb03dLChcFasi9TctF2');
    // const querySnapshot = await getDocs(collection(docRef, 'tasks'));

    const queryItems = query(collection(docRef, 'tasks'), where('isRemoved', '==', false), orderBy('created', 'asc'));
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

export const createPartnerArticle = async (data: Omit<TTask, 'id' | 'created' | 'viewMode'>): Promise<any> => {
  const db = getFirestore();

  try {
    const docRef = doc(db, partnersPostsCollection, 'XM4fZRhsvEb03dLChcFasi9TctF2');
    return await addDoc(collection(docRef, 'tasks'), data).then((docRef) => docRef.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePartnerArticle = async (id: string, data: Partial<TTask>): Promise<any> => {
  const db = getFirestore();
  const ref = doc(db, partnersPostsCollection, 'XM4fZRhsvEb03dLChcFasi9TctF2', 'tasks', id);

  try {
    await updateDoc(ref, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deletePartnerArticle = async (id: string): Promise<any> => {
  const db = getFirestore();
  // const ref = doc(db, partnersPostsCollection, id);
  const ref = doc(db, partnersPostsCollection, 'XM4fZRhsvEb03dLChcFasi9TctF2', 'tasks', id);

  try {
    await deleteDoc(ref);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPartnerArticle = async (id: string): Promise<TTask> => {
  const db = getFirestore();
  const docRef = doc(db, partnersPostsCollection, 'XM4fZRhsvEb03dLChcFasi9TctF2', 'tasks', id);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<TTask, 'id'>;

      return {
        id: docSnap.id,
        ...data,
      };
    } else {
      throw Error('Такой статьи нет');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `${file.name}-${Date.now()}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMainPartnerArticle = async (): Promise<TTask | null> => {
  const db = getFirestore();
  let article = null;

  try {
    const q = query(collection(db, partnersPostsCollection), orderBy('created', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<TTask, 'id'>;

      article = {
        id: doc.id,
        ...data,
      };
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return article;
};
