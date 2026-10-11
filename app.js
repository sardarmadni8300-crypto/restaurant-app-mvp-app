import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { MenuProvider } from './src/context/MenuContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { ReservationsProvider } from './src/context/ReservationsContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

// Every provider wraps the navigator, so any screen can call useAuth / useTheme / useCart ...
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MenuProvider>
            <ReservationsProvider>
              <OrdersProvider>
                <CartProvider>
                  <ThemedStatusBar />
                  <AppNavigator />
                </CartProvider>
              </OrdersProvider>
            </ReservationsProvider>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
