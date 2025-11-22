import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { BookOpen } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Reset error states
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errAny = err as any;
      if (errAny?.code === 'auth/wrong-password' || errAny?.code === 'auth/invalid-credential') {
        setEmailError('Email or password is incorrect');
        setPasswordError('Email or password is incorrect');
      } else if (errAny?.code === 'auth/user-not-found') {
        setEmailError('No account found with this email');
      } else if (errAny?.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address');
      } else if (errAny?.message) {
        setEmailError(errAny.message);
      } else {
        setEmailError('Something went wrong. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <BookOpen color="#4A90E2" size={48} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your Smart Attendance account</Text>
          </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={emailError ? styles.inputError : undefined}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            style={passwordError ? styles.inputError : undefined}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleLogin}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signupText}>
                Don’t have an account?{' '}
                <Text style={styles.signupLinkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Email validation regex
const EMAIL_REGEX = /\S+@\S+\.\S+/;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
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
  signupLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#718096',
  },
  signupLinkText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
});
