import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react-native';

const STUDENTS_STORAGE_KEY = 'app_attendance_students_v1';

export async function loadStoredStudents(): Promise<Student[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Student[];
  } catch (err) {
    console.warn('loadStoredStudents error', err);
    return null;
  }
}

export async function storeStudents(students: Student[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn('storeStudents error', err);
  }
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  isPresent: boolean;
}

export default function TakeAttendanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { className, classId } = params as { className?: string; classId?: string };
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleAttendance = (id: string) => {
    setStudents((prev) => prev.map((student) => (
      student.id === id ? { ...student, isPresent: !student.isPresent } : student
    )));
  };

  const handleSaveAttendance = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save attendance');
        router.replace('/');
        return;
      }

      if (!classId) {
        Alert.alert('Error', 'Missing class id');
        return;
      }

      const presentCount = students.filter(s => s.isPresent).length;
      const totalCount = students.length;

      await addDoc(collection(db, 'attendance'), {
        classId,
        className: className || null,
        teacherId: user.uid,
        date: serverTimestamp(),
        students: students.map((s) => ({ id: s.id, name: s.name, rollNumber: s.rollNumber, isPresent: s.isPresent })),
        presentCount,
        totalCount,
        createdAt: serverTimestamp(),
      });

      // Persist locally too
      await storeStudents(students);

      Alert.alert('Success', 'Attendance saved');
      router.back();
    } catch (err) {
      console.error('Save attendance error:', err);
      Alert.alert('Error', 'Failed to save attendance');
    }
  };

  const presentCount = students.filter(s => s.isPresent).length;
  const totalCount = students.length;

  const renderStudentItem = ({ item }: { item: Student }) => (
    <Card onPress={() => toggleAttendance(item.id)}>
      <View style={styles.studentItem}>
        <View style={styles.studentInfo}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.rollNumber}>Roll No: {item.rollNumber}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleAttendance(item.id)}>
          {item.isPresent ? (
            <CheckCircle2 color="#10B981" size={28} strokeWidth={2.5} />
          ) : (
            <Circle color="#CBD5E0" size={28} />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );

  // Load students from Firestore
  useEffect(() => {
    let unsub: (() => void) | null = null;
    if (!classId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'students'),
      where('classId', '==', classId),
      orderBy('rollNumberNumeric', 'asc')
    );

    unsub = onSnapshot(q, (snapshot) => {
      const list: Student[] = snapshot.docs.map((doc) => {
        const d = doc.data() as any;
        return {
          id: doc.id,
          name: d.name || '',
          rollNumber: d.rollNumber || '',
          isPresent: false,
        };
      });
      setStudents(list);
      setLoading(false);
    }, (err) => {
      console.error('TakeAttendance students error:', err);
      setError((err as any)?.message || String(err));
      setLoading(false);
    });

    return () => unsub && unsub();
  }, [classId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#4A90E2" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Take Attendance</Text>
        <Text style={styles.headerSubtitle}>{className}</Text>
      </View>

      <View style={styles.dateCard}>
        <Text style={styles.dateLabel}>Date</Text>
        <Text style={styles.dateValue}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Present</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{presentCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Absent</Text>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{totalCount - presentCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{totalCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Mark Attendance</Text>
        <Text style={styles.listSubtitle}>Tap on students to mark present</Text>
      </View>

      {loading ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : error ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: '#E53E3E' }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Button title="Save Attendance" onPress={handleSaveAttendance} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  dateCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  listHeader: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  studentDetails: {
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
