import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '@/components/Card';
import { ArrowLeft, Calendar, Users, CheckCircle2, XCircle } from 'lucide-react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface AttendanceRecord {
  id: string;
  date: string; // human-friendly
  presentCount: number;
  absentCount: number;
  totalCount: number;
  students: {
    name: string;
    rollNumber: string;
    isPresent: boolean;
  }[];
}

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { className, classId } = params as { className?: string; classId?: string };

  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'attendance'),
      where('classId', '==', classId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: AttendanceRecord[] = snapshot.docs.map((doc) => {
          const d = doc.data() as any;
          const date = d.createdAt?.toDate ? d.createdAt.toDate() : d.date?.toDate ? d.date.toDate() : new Date();
          const students = (d.students || []).map((s: any) => ({ name: s.name, rollNumber: s.rollNumber, isPresent: !!s.isPresent }));
          const presentCount = d.presentCount ?? students.filter((s: any) => s.isPresent).length;
          const totalCount = d.totalCount ?? students.length;
          const absentCount = totalCount - presentCount;

          return {
            id: doc.id,
            date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
            presentCount,
            absentCount,
            totalCount,
            students,
          };
        });

        setRecords(list);
        setLoading(false);
      },
      (err) => {
        console.error('Attendance listener error:', err);
        setError((err as any)?.message || String(err));
        setLoading(false);
      }
    );

    return () => unsub();
  }, [classId]);

  const renderRecordItem = ({ item }: { item: AttendanceRecord }) => {
    const isExpanded = selectedRecord === item.id;
    const attendanceRate = ((item.presentCount / (item.totalCount || 1)) * 100).toFixed(0);

    return (
      <Card onPress={() => setSelectedRecord(isExpanded ? null : item.id)}>
        <View style={styles.recordHeader}>
          <View style={styles.dateContainer}>
            <Calendar color="#4A90E2" size={20} />
            <Text style={styles.recordDate}>{item.date}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <CheckCircle2 color="#10B981" size={16} />
              <Text style={[styles.statText, { color: '#10B981' }]}>{item.presentCount}</Text>
            </View>
            <View style={styles.statBadge}>
              <XCircle color="#EF4444" size={16} />
              <Text style={[styles.statText, { color: '#EF4444' }]}>{item.absentCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${attendanceRate}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{attendanceRate}% attendance</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <Text style={styles.studentListTitle}>Student Details</Text>
            {item.students.map((student, index) => (
              <View key={index} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll: {student.rollNumber}</Text>
                </View>
                <View style={[styles.statusBadge, student.isPresent ? styles.presentBadge : styles.absentBadge]}>
                  <Text style={[styles.statusText, student.isPresent ? styles.presentText : styles.absentText]}>
                    {student.isPresent ? 'Present' : 'Absent'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#4A90E2" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance History</Text>
        <Text style={styles.headerSubtitle}>{className}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Users color="#4A90E2" size={24} />
            <Text style={styles.summaryValue}>{records.length}</Text>
            <Text style={styles.summaryLabel}>Records</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <CheckCircle2 color="#10B981" size={24} />
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {records.length > 0 ? Math.round(records.reduce((acc, r) => acc + (r.presentCount / (r.totalCount || 1)), 0) / records.length * 100) : 0}%
            </Text>
            <Text style={styles.summaryLabel}>Avg. Attendance</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Past Records</Text>
        <Text style={styles.listSubtitle}>Tap to view details</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  summaryDivider: {
      marginTop: 20,
    height: 60,
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
  },
  recordHeader: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'right',
  },
  expandedContent: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  studentListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  studentRoll: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  presentBadge: {
    backgroundColor: '#D1FAE5',
  },
  absentBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presentText: {
    color: '#059669',
  },
  absentText: {
    color: '#DC2626',
  },
  loader: {
    marginTop: 24,
  },
});
