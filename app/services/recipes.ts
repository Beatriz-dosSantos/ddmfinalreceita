import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { db } from '../../firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { uploadToCloudinary } from './cloudinary';

const COLLECTION_NAME = 'receitas';

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const recipes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Recipe, 'id'>),
  }));
  return recipes;
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return { id: docSnap.id, ...(docSnap.data() as Omit<Recipe, 'id'>) };
};

export const addRecipe = async (recipe: Omit<Recipe, 'id'>): Promise<void> => {
  await addDoc(collection(db, COLLECTION_NAME), recipe);
};

export const updateRecipe = async (
  id: string,
  updated: Partial<Omit<Recipe, 'id'>>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updated);
};

export const deleteRecipeById = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};