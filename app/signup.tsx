import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { BookOpen, ArrowLeft } from 'lucide-react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Success', 'Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.log('Signup error', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Signup Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#4A90E2" size={24} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <BookOpen color="#4A90E2" size={48} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Smart Attendance today</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <Button title={loading ? 'Creating...' : 'Create Account'} onPress={handleSignup} disabled={loading} />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLinkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#312525ff',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 24,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#718096',
  },
  loginLinkText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
