// app/create-profile.tsx
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

  // Profile fields with demo data pre-filled
  const [displayName, setDisplayName] = useState('Rahul Sharma');
  const [username, setUsername] = useState('rahulsharma');
  const [bio, setBio] = useState('🎨 Design enthusiast | 📸 Visual storyteller');
  const [collegeTag, setCollegeTag] = useState('MIT • 2026');
  const [profileImage, setProfileImage] = useState<string | null>('https://i.pravatar.cc/150?img=11');

  // Focus states for inline editing
  const [editingField, setEditingField] = useState<string | null>(null);

  // ---------- IMAGE PICKER ----------
  const pickImage = async () => {
    // 1. Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission needed to access your photos. Please enable it in settings.');
      return;
    }

    // 2. Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop for avatar
      quality: 0.8,
    });

    // 3. Handle the result
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
          {/* ===== PROFILE HEADER ===== */}
          <View style={styles.header}>
            {/* Settings Icon - Top Right */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Navigate to settings
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* ===== PROFILE CONTENT ===== */}
          <View style={styles.profileContainer}>
            {/* Row: Avatar + Name/Username */}
            <View style={styles.profileRow}>
              {/* Avatar */}
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={pickImage} // <-- Image picker on press
                activeOpacity={0.7}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>📸</Text>
                  </View>
                )}
                <View style={styles.editBadge}>
                  <Text style={styles.editBadgeText}>✎</Text>
                </View>
              </TouchableOpacity>

              {/* Name + Username */}
              <View style={styles.nameContainer}>
                {/* Display Name */}
                <TouchableOpacity
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
                    <Text style={styles.fieldValueName}>
                      {displayName}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Username */}
                <TouchableOpacity
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
                    <Text style={styles.fieldValueUsername}>
                      @{username}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Bio */}
            <TouchableOpacity
              style={styles.bioContainer}
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
                <Text style={styles.fieldValueBio}>
                  {bio}
                </Text>
              )}
            </TouchableOpacity>

            {/* College Tag - Pill shaped */}
            <TouchableOpacity
              style={styles.tagContainer}
              onPress={() => setEditingField('collegeTag')}
              activeOpacity={0.7}
            >
              {editingField === 'collegeTag' ? (
                <TextInput
                  style={styles.fieldInputTag}
                  value={collegeTag}
                  onChangeText={setCollegeTag}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  placeholder="College • Year"
                  placeholderTextColor={Colors.textMuted}
                />
              ) : (
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{collegeTag}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ===== DIVIDER ===== */}
          <View style={styles.divider} />

          {/* ===== CONTINUE BUTTON ===== */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!displayName || !username) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!displayName || !username}
          >
            <Text style={styles.continueButtonText}>
              Continue →
            </Text>
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

// ---------- STYLES (unchanged from your latest) ----------
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  profileContainer: {
    paddingTop: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.gradientStart,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 28,
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
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldValueName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Onest_600SemiBold',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  fieldInputName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Onest_600SemiBold',
    letterSpacing: -0.5,
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
  },
  fieldValueUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: -0.3,
  },
  fieldInputUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: -0.3,
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
  },
  bioContainer: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  fieldValueBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  fieldInputBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 20,
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  tagContainer: {
    marginBottom: 4,
  },
  tagPill: {
    backgroundColor: 'rgba(16, 219, 182, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(16, 219, 182, 0.20)',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    color: Colors.gradientStart,
    fontFamily: 'Barlow_500Medium',
    letterSpacing: 0.3,
  },
  fieldInputTag: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Barlow_500Medium',
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.gradientStart,
    paddingVertical: 2,
    minWidth: 120,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 28,
    width: '100%',
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
    opacity: 0.4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Onest_600SemiBold',
  },
  loginLink: {
    marginTop: 4,
    paddingVertical: 8,
  },
  loginText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  loginHighlight: {
    color: Colors.gradientStart,
    fontFamily: 'Barlow_600SemiBold',
  },
});