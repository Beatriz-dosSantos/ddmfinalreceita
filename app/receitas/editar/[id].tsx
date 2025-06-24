import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getRecipeById, updateRecipe } from '../../services/recipes';
import { uploadToCloudinary } from '../../services/cloudinary';
//import { Recipe } from '../../types/recipe';
import ErroCamposObrigatoriosModal from '../../components/ErroCamposObrigatoriosModal ';
import SucessoReceitaModal from '../../components/SucessoReceitaModal';

export default function EditarReceita() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const carregarReceita = async () => {
      if (!id) return;
      const receita = await getRecipeById(id);
      if (receita) {
        setNome(receita.nome);
        setIngredientes(receita.ingredientes);
        setPreparo(receita.preparo);
        setOriginalImageUrl(receita.imagem || null);
      }
      setLoading(false);
    };

    carregarReceita();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const salvarEdicao = async () => {
    if (!id || !nome || !ingredientes || !preparo) {
      setShowError(true);
      return;
    }

    try {
      let imageUrl = originalImageUrl || '';

      if (imageUri && imageUri !== originalImageUrl) {
        imageUrl = await uploadToCloudinary(imageUri);
      }

      await updateRecipe(id, {
        nome,
        ingredientes,
        preparo,
        imagem: imageUrl,
      });

      setShowSuccess(true);
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      setShowError(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Receita</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da receita"
          placeholderTextColor={"#E7A5A5"}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Ingredientes"
          placeholderTextColor={"#E7A5A5"}
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Modo de preparo"
          placeholderTextColor={"#E7A5A5"}
          value={preparo}
          onChangeText={setPreparo}
          multiline
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Selecionar nova imagem</Text>
        </TouchableOpacity>

        {imageUri || originalImageUrl ? (
          <Image source={{ uri: imageUri || originalImageUrl || '' }} style={styles.image} />
        ) : null}

        <TouchableOpacity style={styles.saveButton} onPress={salvarEdicao}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>

      <ErroCamposObrigatoriosModal visible={showError} onClose={() => setShowError(false)} />

      <SucessoReceitaModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push('/(tabs)/');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF1F3',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#843B4D',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4C2C2',
    backgroundColor: '#FFF8F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: '#843B4D',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 14,
  },
  imageButton: {
    backgroundColor: '#EFA7A7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#B35C79',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF0F5',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
