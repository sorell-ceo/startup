// app/create-profile.tsx
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';

export default function CreateProfile() {
  const router = useRouter();

  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [collegeTag, setCollegeTag] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // UI states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  const collegeOptions = [
    'GGDSD, Chandigarh',
    'VIT Chennai',
    'LPU Punjab',
  ];

  const DROPDOWN_ITEM_HEIGHT = 48;
  const dropdownMaxHeight = collegeOptions.length * DROPDOWN_ITEM_HEIGHT;

  // Animated value drives the dropdown open/close.
  // NOT LayoutAnimation — it's unreliable on Android when a TextInput with
  // autoFocus is mounted in the same tree, which this screen has (name/username/bio).
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const arrowRotation = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // ---------- IMAGE PICKER ----------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      // Alert.alert — global alert() does not exist in React Native and will throw
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // check this against your installed expo-image-picker version — some SDKs deprecate this enum
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // ---------- COLLEGE DROPDOWN (Animated, not LayoutAnimation) ----------
  const toggleCollegeDropdown = () => {
    const opening = !showCollegeDropdown;
    setShowCollegeDropdown(opening);
    Animated.timing(dropdownAnim, {
      toValue: opening ? 1 : 0,
      duration: 240,
      useNativeDriver: false,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const selectCollege = (college: string) => {
    setCollegeTag(college);
    setShowCollegeDropdown(false);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ---------- CONTINUE HANDLER ----------
  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: './signup',
      params: {
        displayName,
        username,
        bio,
        collegeTag,
        profileImage: profileImage || '',
      },
    });
  };

  const isFormValid = displayName.length > 0 && username.length > 0 && collegeTag.length > 0;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== TOP BAR ===== */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Add more profile-related action
              }}
              activeOpacity={0.7}
            >
              <View style={styles.plusIconContainer}>
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.topBarTitle}>Your Profile</Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Open menu
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="menu" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* ===== PROFILE FRAME ===== */}
          <View style={styles.profileFrame}>
            {/* Avatar — left aligned, no longer centered */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="account-circle" size={48} color="rgba(255,255,255,0.35)" />
                </View>
              )}
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>✎</Text>
              </View>
            </TouchableOpacity>

            {/* Fields block — sits BELOW the avatar now, full width, left aligned */}
            <View style={styles.fieldsBlock}>
              {/* Display Name */}
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => setEditingField('displayName')}
                activeOpacity={0.7}
              >
                {editingField === 'displayName' ? (
                  <TextInput
                    style={styles.fieldInputName}
                    value={displayName}
                    onChangeText={setDisplayName}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    placeholder="Your display name"
                    placeholderTextColor={Colors.textMuted}
                  />
                ) : (
                  <Text style={[styles.fieldValueName, !displayName && styles.placeholder]}>
                    {displayName || 'Tap to add name'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Username */}
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => setEditingField('username')}
                activeOpacity={0.7}
              >
                {editingField === 'username' ? (
                  <TextInput
                    style={styles.fieldInputUsername}
                    value={username}
                    onChangeText={setUsername}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    placeholder="@username"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={[styles.fieldValueUsername, !username && styles.placeholder]}>
                    {username ? `@${username}` : 'Tap to set username'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Bio */}
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => setEditingField('bio')}
                activeOpacity={0.7}
              >
                {editingField === 'bio' ? (
                  <TextInput
                    style={styles.fieldInputBio}
                    value={bio}
                    onChangeText={setBio}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    maxLength={100}
                  />
                ) : (
                  <Text style={[styles.fieldValueBio, !bio && styles.placeholder]}>
                    {bio || 'Tap to add bio (optional)'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* College Tag */}
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={toggleCollegeDropdown}
                activeOpacity={0.7}
              >
                <View style={styles.tagPill}>
                  <Text style={[styles.tagText, !collegeTag && styles.placeholder]}>
                    {collegeTag || 'Tap to select college'}
                  </Text>
                  <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={18}
                      color={Colors.gradientStart}
                    />
                  </Animated.View>
                </View>
              </TouchableOpacity>

              {/* Animated Dropdown */}
              <Animated.View
                style={[
                  styles.dropdownContainer,
                  {
                    maxHeight: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, dropdownMaxHeight],
                    }),
                    opacity: dropdownAnim,
                    marginTop: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 8],
                    }),
                  },
                ]}
                pointerEvents={showCollegeDropdown ? 'auto' : 'none'}
              >
                {collegeOptions.map((college, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      index === collegeOptions.length - 1 && styles.dropdownItemLast,
                    ]}
                    onPress={() => selectCollege(college)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dropdownText}>{college}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </View>

          {/* ===== CONTINUE BUTTON ===== */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continue →</Text>
          </TouchableOpacity>

          {/* ===== LOGIN LINK ===== */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  iconButton: {
    padding: 4,
  },
  plusIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontFamily: 'Onest_600SemiBold',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  profileFrame: {
    backgroundColor: '#080808',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 28,
    borderWidth: 0,
    alignItems: 'flex-start', // was 'center' — required for left alignment
  },
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
    alignSelf: 'flex-start', // pins avatar to the left instead of stretching/centering
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.gradientStart,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#080808',
  },
  editBadgeText: {
    color: '#080808',
    fontSize: 12,
    fontWeight: '700',
  },
  // New wrapper: holds all fields BELOW the avatar, full width, left aligned
  fieldsBlock: {
    width: '100%',
    alignItems: 'flex-start',
  },
  fieldRow: {
    width: '100%',
    paddingVertical: 6,
  },
  fieldValueName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Barlow_500Medium',
    letterSpacing: -0.4,
    marginBottom: 0,
    marginTop: -16,
    textAlign: 'left', // was center — now left-aligned under the avatar
  },
  fieldInputName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Barlow_500Medium',
    letterSpacing: -0.4,
    textAlign: 'left',
    padding: 0,
    borderBottomWidth: 1.5,
    marginBottom: -16,
    marginTop: 0,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
  },
  fieldValueUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Barlow_500Medium',
    letterSpacing: -0.4,
    textAlign: 'left',
    marginBottom: -4,
    marginTop: 0,
  },
  fieldInputUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Barlow_500Medium',
    letterSpacing: -0.4,
    textAlign: 'left',
    padding: 0,
    marginBottom: -10,
    marginTop: -10,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
  },
  fieldValueBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Barlow_500Medium',
    lineHeight: 20,
    letterSpacing: -0.4,
    textAlign: 'left',
    marginBottom: -20,
    marginTop: -4,
  },
  fieldInputBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Barlow_500Medium',
    lineHeight: 20,
    textAlign: 'left',
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 219, 182, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 219, 182, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start', // was center — pill now hugs left instead of centering
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    color: Colors.gradientStart,
    fontFamily: 'Barlow_500Medium',
    letterSpacing: -0.3,
  },
  dropdownContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Barlow_500Medium',
    textAlign: 'left',
  },
  placeholder: {
    color: 'rgba(255,255,255,0.3)',
  },
  continueButton: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.3,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Onest_500Medium',
  },
  loginLink: {
    marginTop: 4,
    paddingVertical: 8,
  },
  loginText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Barlow_500Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  loginHighlight: {
    color: Colors.gradientStart,
    fontFamily: 'Barlow_500Medium',
  },
});