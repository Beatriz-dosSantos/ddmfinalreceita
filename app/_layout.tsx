import { Stack } from 'expo-router';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import AppLoading from 'expo-app-loading'; 

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)/index"
        options={{
          title: "Página Inicial",
          headerStyle: { backgroundColor: "#D9849F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="receitas/favoritos"
        options={{
          title: "Favoritos",
          headerStyle: { backgroundColor: "#D9849F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="receitas/nova"
        options={{
          title: "Criar nova receita",
          headerStyle: { backgroundColor: "#D9849F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="receitas/[id]"
        options={{
          title: "Visualizar receita",
          headerStyle: { backgroundColor: "#D9849F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="receitas/editar/[id]"
        options={{
          title: "",
          headerStyle: { backgroundColor: "#D9849F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}
