import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FloatingButtonProps {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Plus color="#FFFFFF" size={28} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
