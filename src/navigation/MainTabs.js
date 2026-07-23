// MainTabs.js (in navigation folder)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';

import HomeIcon from '../../assets/icons/Home.svg';
import LikeIcon from '../../assets/icons/Like.svg';
import MessageIcon from '../../assets/icons/Message.svg';
import ProfileIcon from '../../assets/icons/Profile.svg';
import SearchIcon from '../../assets/icons/Search.svg';

import CompetitionScreen from '../screens/CompetitionScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileStack from '../screens/ProfileStack';
import SearchScreen from '../screens/SearchScreen';
import MessagesStack from './MessagesStack';

const Tab = createBottomTabNavigator();

const ICON_COMPONENTS = {
  Home: HomeIcon,
  Search: SearchIcon,
  Competition: LikeIcon,
  Messages: MessageIcon,
  Profile: ProfileIcon,
};

const ICON_SIZE = 23;

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#E4E4E4',
        tabBarInactiveTintColor: 'transparent',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#08080ca9',
          height: 62,
          paddingLeft:8,
          paddingRight:8,
          paddingBottom: 8,
          alignContent: 'center',
          paddingTop: 10,
          borderTopWidth: 0,
          marginBottom: 8,
          marginLeft: 8,
          marginRight: 8,
          borderRadius: 40,
          overflow: 'hidden',
          elevation: 10,
        },
         tabBarBackground: () => (
         <BlurView
           intensity={75}
           tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarIcon: ({ color }) => {
          const IconComponent = ICON_COMPONENTS[route.name];
          return <IconComponent width={ICON_SIZE} height={ICON_SIZE} fill={color} />;
        },
        tabBarButton: (props) => <TabButtonWithHaptics {...props} />,
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