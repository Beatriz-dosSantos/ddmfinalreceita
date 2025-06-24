import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/recipe";
import { getRecipeById } from "./recipes";

const FAVORITES_KEY = "@receitas_favoritas_objetos";

export async function toggleFavoriteRecipe(recipe: Recipe): Promise<boolean> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  let current: Recipe[] = stored ? JSON.parse(stored) : [];

  const exists = current.find((r) => r.id === recipe.id);

  let updated: Recipe[];

  if (exists) {
    // Se já existe, remove
    updated = current.filter((r) => r.id !== recipe.id);
  } else {
    // Se não existe, adiciona
    updated = [...current, recipe];
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  const raw: Recipe[] = stored ? JSON.parse(stored) : [];

  const valid: Recipe[] = [];

  for (const r of raw) {
    const fullRecipe = await getRecipeById(r.id);
    if (fullRecipe) {
      valid.push(r);
    }
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(valid));
  return valid;
}
