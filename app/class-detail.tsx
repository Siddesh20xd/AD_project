import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Users, Calendar, History } from 'lucide-react-native';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card } from '@/components/Card';
import Button from '@/components/Button';

export default function ClassDetailScreen() {
  const router = useRouter();
  const { id: classId, name: className } = useLocalSearchParams<{ id: string; name: string }>();
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'history'>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ----------------- Real-time listener -----------------
  useEffect(() => {
    if (!classId) return;
    // Order students by numeric roll number ascending.
    const q = query(
      collection(db, 'students'),
      where('classId', '==', classId),
      orderBy('rollNumberNumeric', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setStudents(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading students:', err);
        const message = err?.message || String(err);
        setError(message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [classId]);

  // ----------------- Add Student Inline -----------------
  const [showForm, setShowForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddStudent = async () => {
    if (!studentName.trim() || !rollNumber.trim()) {
      Alert.alert('Validation', 'Please provide both name and roll number');
      return;
    }

    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      await addDoc(collection(db, 'students'), {
        name: studentName.trim(),
        rollNumber: rollNumber.trim(),
        rollNumberNumeric: Number.isNaN(Number.parseInt(rollNumber.trim(), 10)) ? 0 : Number.parseInt(rollNumber.trim(), 10),
        classId,
        teacherId: user.uid,
        createdAt: new Date(),
      });

      setStudentName('');
      setRollNumber('');
      setShowForm(false);
      Alert.alert('Success', 'Student added successfully');
    } catch (err) {
      console.error('Add student error:', err);
      Alert.alert('Error', 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- Tabs -----------------
  const renderTabButton = (label: string, value: any, Icon: any) => {
    const isActive = activeTab === value;
    return (
      <TouchableOpacity
        key={value}
        onPress={() => setActiveTab(value)}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: isActive ? '#EBF5FF' : 'transparent',
        }}
      >
        <Icon color={isActive ? '#4A90E2' : '#6B7280'} size={18} />
        <Text style={{ color: isActive ? '#4A90E2' : '#6B7280', marginTop: 6, fontWeight: '600' }}>{label}</Text>
      </TouchableOpacity>
    );
  };

  // ----------------- Students Tab -----------------
  const renderStudentsTab = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Try Again" onPress={() => { setError(''); setLoading(true); }} />
        </View>
      );
    }

    return (
      <View>
        <View style={styles.actionButtons}>
          {!showForm ? (
            <Button title="Add Student" onPress={() => setShowForm(true)} />
          ) : (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Student Name"
                value={studentName}
                onChangeText={setStudentName}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Roll Number"
                value={rollNumber}
                onChangeText={setRollNumber}
                placeholderTextColor="#888"
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button
                  title={saving ? 'Adding...' : 'Save'}
                  onPress={handleAddStudent}
                  disabled={saving}
                />
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowForm(false);
                    setStudentName('');
                    setRollNumber('');
                  }}
                />
              </View>
            </View>
          )}
        </View>

        {students.length === 0 ? (
          <View style={styles.emptyState}>
            <Users color="#718096" size={48} />
            <Text style={styles.emptyStateText}>No students yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add students to start taking attendance
            </Text>
          </View>
        ) : (
          students.map((student) => (
            <Card key={student.id}>
              <View style={styles.studentItem}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.rollNumber}>Roll No: {student.rollNumber}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
    );
  };

  // ----------------- Placeholder Tabs -----------------
  const renderAttendanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.placeholder}>Take attendance for this class.</Text>
      <View style={{ marginTop: 16 }}>
        <Button
          title="Take Attendance"
          onPress={() => router.push(`/take-attendance?classId=${classId}&className=${encodeURIComponent(className || '')}`)}
        />
      </View>
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.placeholder}>View past attendance records for this class.</Text>
      <View style={{ marginTop: 16 }}>
        <Button
          title="View History"
          onPress={() => router.push(`/attendance-history?classId=${classId}&className=${encodeURIComponent(className || '')}`)}
        />
      </View>
    </View>
  );

  // ----------------- Main -----------------
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <ArrowLeft color="#4A90E2" size={20} />
        </TouchableOpacity>
        <Text style={styles.classTitle}>{className}</Text>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('Students', 'students', Users)}
        {renderTabButton('Attendance', 'attendance', Calendar)}
        {renderTabButton('History', 'history', History)}
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'students'
          ? renderStudentsTab()
          : activeTab === 'attendance'
          ? renderAttendanceTab()
          : renderHistoryTab()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  classTitle: { fontSize: 20, fontWeight: '600', color: '#1A202C' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  tabContent: { padding: 16 },
  actionButtons: { marginBottom: 16 },
  studentItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  studentAvatar: {
    backgroundColor: '#4A90E2',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  studentInfo: { marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: '500' },
  rollNumber: { color: '#6B7280' },
  centerContent: { alignItems: 'center', justifyContent: 'center', marginVertical: 40 },
  errorText: { color: '#E53E3E', marginBottom: 8 },
  placeholder: { color: '#6B7280', fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#1A202C', marginTop: 12 },
  emptyStateSubtext: { fontSize: 14, color: '#718096', marginTop: 4 },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
});
