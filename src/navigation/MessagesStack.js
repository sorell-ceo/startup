import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../navigation/ChatScreen';
import MessagesScreen from '../navigation/MessagesScreen';

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}