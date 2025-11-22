import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#A0AEC0"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#FC8181',
  },
  errorText: {
    fontSize: 12,
    color: '#FC8181',
    marginTop: 4,
  },
});
