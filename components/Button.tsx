import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        (disabled || loading) && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#4A90E2' : '#FFFFFF'} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary' && styles.primaryText,
          variant === 'secondary' && styles.secondaryText,
          variant === 'outline' && styles.outlineText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: '#4A90E2',
  },
  secondary: {
    backgroundColor: '#F5F7FA',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#333333',
  },
  outlineText: {
    color: '#4A90E2',
  },
});
