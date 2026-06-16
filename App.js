import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator } from 'react-native';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

const LoadingView = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
    <ActivityIndicator size="large" color={COLORS.accent} />
  </View>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
