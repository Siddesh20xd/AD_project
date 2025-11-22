import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Card, CardHeader } from '@/components/Card';
import FloatingButton from '@/components/FloatingButton';
import { Users, BookOpen } from 'lucide-react-native';
import { 
  collection, 
  query, 
  orderBy, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Class {
  id: string;
  className: string;
  subject: string;
  studentCount: number;
  createdAt: Date;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check auth first
    if (!auth.currentUser) {
      router.replace('/');
      return;
    }

    const user = auth.currentUser;

    // ✅ Query Firestore for teacher's classes
    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', user?.uid),
      orderBy('createdAt', 'desc')
    );

    // ✅ Real-time listener
    const unsubscribe = onSnapshot(
      classesQuery,
      (querySnapshot) => {
        const classList: Class[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          classList.push({
            id: doc.id,
            className: data.className,
            subject: data.subject,
            studentCount: data.studentCount || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });

        setClasses(classList);
        setLoading(false);
      },
      (error) => {
        console.error('Realtime error:', error);
        Alert.alert('Error', 'Failed to load classes. Please try again.');
        setLoading(false);
      }
    );

    // 🧹 Cleanup listener on unmount
    return () => unsubscribe();
  }, [router]);

  const renderClassItem = ({ item }: { item: Class }) => (
    <Card
      onPress={() =>
        router.push(
          `/class-detail?id=${item.id}&name=${item.className}&subject=${item.subject}`
        )
      }
    >
      <View style={styles.classCard}>
        <View style={styles.iconContainer}>
          <BookOpen color="#4A90E2" size={28} />
        </View>
        <View style={styles.classInfo}>
          <CardHeader title={item.className} subtitle={item.subject} />
          <View style={styles.studentCount}>
            <Users color="#718096" size={16} />
            <Text style={styles.studentText}>{item.studentCount} students</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
        <Text style={styles.headerSubtitle}>
          Manage your classes and attendance
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : classes.length === 0 ? (
        <View style={styles.emptyState}>
          <BookOpen color="#718096" size={48} />
          <Text style={styles.emptyText}>No classes yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first class to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingButton onPress={() => router.push('/add-class')} />
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
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  loader: {
    marginTop: 50,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#2D3748',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  classInfo: {
    flex: 1,
  },
  studentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  studentText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 6,
  },
});
