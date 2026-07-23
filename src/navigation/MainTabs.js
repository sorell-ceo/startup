//MainTabs.js (in navigation folder)

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';

import CompetitionScreen from '../screens/CompetitionScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileStack from '../screens/ProfileStack';
import SearchScreen from '../screens/SearchScreen';
import MessagesStack from './MessagesStack';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  Search: 'search',
  Competition: 'trophy',
  Messages: 'chatbubble-ellipses',
  Profile: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E4E4E4',
        tabBarInactiveTintColor: '#5c6263',
        tabBarStyle: {
          backgroundColor: '#08080C',
          height: 62,
          paddingBottom: 8,
          alignContent:'center',
          paddingTop: 6,
          borderTopWidth: 1,
          marginBottom:12,
          marginLeft:8,
          marginRight:8,
          borderRadius:30,
          borderTopColor: '#020202',
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
        tabBarButton: (props) => (
          <TabButtonWithHaptics {...props} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Competition" component={CompetitionScreen} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// Wraps the default tab button to fire haptic feedback on press
import { Pressable } from 'react-native';

function TabButtonWithHaptics({ children, onPress, ...rest }) {
  const handlePress = (e) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable {...rest} onPress={handlePress}>
      {children}
    </Pressable>
  );
}