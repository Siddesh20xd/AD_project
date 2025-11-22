import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  Keyboard 
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card } from '@/components/Card';
import { ArrowLeft } from 'lucide-react-native';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export default function AddStudentScreen() {
  const router = useRouter();
  const { className, classId } = useLocalSearchParams();
  
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // --- Auth state listener ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace('/');
      } else {
        setUser(u);
      }
    });
    return unsubscribeAuth;
  }, []);

  // --- Realtime listener for students ---
  useEffect(() => {
    if (!classId || !user) {
      setLoading(false);
      return;
    }

    const studentsQuery = query(
      collection(db, 'students'),
      where('classId', '==', classId),
      where('teacherId', '==', user.uid),
      // order by numeric roll number ascending for proper ordering
      orderBy('rollNumberNumeric', 'asc')
    );

    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        const list: Student[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setStudents(list);
        setLoading(false);
      },
      (err) => {
          console.error('Students listener error:', err);
          const message = (err as any)?.message || String(err);
          setError(message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [classId, user]);

  // --- Add new student ---
  const handleAddStudent = async () => {
    if (!studentName.trim() || !rollNumber.trim()) return;

    try {
      setSaving(true);

      if (!user) {
        Alert.alert('Error', 'You must be logged in.');
        router.replace('/');
        setSaving(false);
        return;
      }

      if (!classId) {
        Alert.alert('Error', 'Missing class ID.');
        setSaving(false);
        return;
      }

      // Duplicate check
      const existingQuery = query(
        collection(db, 'students'),
        where('classId', '==', classId),
        where('rollNumber', '==', rollNumber.trim())
      );
      const snapshot = await getDocs(existingQuery);
      if (!snapshot.empty) {
        Alert.alert('Duplicate', 'This roll number already exists in this class.');
        setSaving(false);
        return;
      }

      const rollNumberNumeric = Number.parseInt(rollNumber.trim(), 10);

      await addDoc(collection(db, 'students'), {
        name: studentName.trim(),
        rollNumber: rollNumber.trim(),
        rollNumberNumeric: Number.isNaN(rollNumberNumeric) ? 0 : rollNumberNumeric,
        classId,
        teacherId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStudentName('');
      setRollNumber('');
      setSaving(false);

      Alert.alert('Success', 'Student added successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Add student error:', err);
      Alert.alert('Error', 'Failed to add student. Please try again.');
      setSaving(false);
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <Card>
      <View style={styles.studentItem}>
        <View style={styles.studentAvatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.rollNumber}>Roll No: {item.rollNumber}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color="#4A90E2" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Students</Text>
            <Text style={styles.headerSubtitle}>{className}</Text>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <>
                  <View style={styles.form}>
                    <Input
                      label="Student Name"
                      placeholder="Enter student name"
                      value={studentName}
                      onChangeText={setStudentName}
                    />

                    <Input
                      label="Roll Number"
                      placeholder="Enter roll number"
                      value={rollNumber}
                      onChangeText={setRollNumber}
                      keyboardType="numeric"
                    />

                    <Button
                      title={saving ? 'Adding...' : 'Add Student'}
                      onPress={handleAddStudent}
                      loading={saving}
                      disabled={
                        saving || !studentName.trim() || !rollNumber.trim()
                      }
                    />
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.listTitle}>
                    Current Students ({students.length})
                  </Text>
                </>
              }
              data={students}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                !loading && (
                  <Text style={{ textAlign: 'center', color: '#718096', marginTop: 12 }}>
                    No students added yet.
                  </Text>
                )
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  listContainer: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 14,
    color: '#718096',
  },
});
