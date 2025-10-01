import * as React from 'react';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { View } from 'react-native';

export default function App() {
  return (
    <PaperProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>SecureParcel 🚀</Text>
        <Button mode="contained" onPress={() => console.log('Button Pressed')}>
          Test Button
        </Button>
      </View>
    </PaperProvider>
  );
}
