import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="add-class" />
        <Stack.Screen name="class-detail" />
        <Stack.Screen name="add-student" />
        <Stack.Screen name="take-attendance" />
        <Stack.Screen name="attendance-history" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
