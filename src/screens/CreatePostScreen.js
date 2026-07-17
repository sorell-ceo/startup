import { decode } from 'base64-arraybuffer';
import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const CATEGORIES = ['club', 'event', 'hostel', 'study', 'campus'];

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [media, setMedia] = useState(null); // { uri, type: 'photo'|'video', base64? }
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(null);
  const [locationTag, setLocationTag] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'We need access to your media to create a post.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
      base64: false, // videos can't be base64-loaded directly; we'll read file separately
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const isVideo = asset.type === 'video';

    setMedia({
      uri: asset.uri,
      type: isVideo ? 'video' : 'photo',
    });
  };

  const handlePost = async () => {
    if (!media) {
      Alert.alert('Missing media', 'Please select a photo or video.');
      return;
    }
    if (!category) {
      Alert.alert('Missing category', 'Please select a category.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = media.type === 'video' ? 'mp4' : 'jpg';
      const contentType = media.type === 'video' ? 'video/mp4' : 'image/jpeg';
      const postId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const filePath = `${user.id}/${postId}.${fileExt}`;

      // Read file as base64, works for both images and videos via FileSystem
      const base64 = await FileSystem.readAsStringAsync(media.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const { error: uploadError } = await supabase.storage
        .from('reels')
        .upload(filePath, arrayBuffer, { contentType, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('reels')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        media_urls: [publicUrlData.publicUrl],
        media_type: media.type,
        caption: caption.trim(),
        category,
        location_tag: locationTag.trim() || null,
      });

      if (insertError) throw insertError;

      navigation.goBack();
    } catch (err) {
      console.error('Post creation failed:', err);
      Alert.alert('Post Failed', err.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <TouchableOpacity onPress={handlePost} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator size="small" color="#3498db" />
            ) : (
              <Text style={styles.postText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mediaPicker} onPress={pickMedia}>
          {media ? (
            media.type === 'video' ? (
              <Video
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                resizeMode={ResizeMode.COVER}
                useNativeControls
              />
            ) : (
              <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            )
          ) : (
            <Text style={styles.mediaPlaceholder}>Tap to select photo or video</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          placeholderTextColor="#999"
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Location Tag (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Library 2nd Floor"
          placeholderTextColor="#999"
          value={locationTag}
          onChangeText={setLocationTag}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: { color: '#7f8c8d', fontSize: 15 },
  title: { fontSize: 17, fontWeight: '700', color: '#2c3e50' },
  postText: { color: '#3498db', fontSize: 16, fontWeight: '700' },
  mediaPicker: {
    height: 260,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  mediaPreview: { width: '100%', height: '100%' },
  mediaPlaceholder: { color: '#7f8c8d', fontSize: 15 },
  captionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#7f8c8d', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chipActive: { backgroundColor: '#3498db' },
  chipText: { color: '#7f8c8d', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
});