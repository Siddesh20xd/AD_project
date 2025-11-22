import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
}

export function Card({ children, onPress }: CardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.card} onPress={onPress}>
      {children}
    </Container>
  );
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
  },
});
