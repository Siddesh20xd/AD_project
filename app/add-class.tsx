import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { ArrowLeft } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function AddClassScreen() {
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [classNameError, setClassNameError] = useState('');
  const [subjectError, setSubjectError] = useState('');

  const handleCreateClass = async () => {
    setClassNameError('');
    setSubjectError('');

    let hasError = false;
    if (!className.trim()) {
      setClassNameError('Class name is required');
      hasError = true;
    }
    if (!subject.trim()) {
      setSubjectError('Subject is required');
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create a class.');
        router.push('/');
        return;
      }

      await addDoc(collection(db, 'classes'), {
        teacherId: user.uid,
        className: className.trim(),
        subject: subject.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Class created successfully!');
      setClassName('');
      setSubject('');
      router.back();
    } catch (err: any) {
      console.error('Error creating class:', err);
      Alert.alert('Error', err?.message || 'Something went wrong.');
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color="#4A90E2" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Class</Text>
            <Text style={styles.headerSubtitle}>Create a new class to manage attendance</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Class Name"
              placeholder="e.g., Class 10A"
              value={className}
              onChangeText={(text) => {
                setClassName(text);
                setClassNameError('');
              }}
              style={classNameError ? styles.errorInput : {}}
            />
            {classNameError ? <Text style={styles.errorText}>{classNameError}</Text> : null}

            <Input
              label="Subject"
              placeholder="e.g., Mathematics"
              value={subject}
              onChangeText={(text) => {
                setSubject(text);
                setSubjectError('');
              }}
              style={subjectError ? styles.errorInput : {}}
            />
            {subjectError ? <Text style={styles.errorText}>{subjectError}</Text> : null}

            <View style={styles.buttonContainer}>
              <Button
                title={loading ? 'Creating...' : 'Create Class'}
                onPress={handleCreateClass}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginBottom: 32 },
  backButton: { marginBottom: 16 },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 16, color: '#718096' },
  form: { flex: 1 },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorInput: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  buttonContainer: { marginTop: 24 },
});
