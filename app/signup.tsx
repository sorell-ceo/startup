// app/signup.tsx
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

// ---------- REUSABLE FLOATING LABEL INPUT ----------
// ---------- REUSABLE FLOATING LABEL INPUT (with proper types) ----------
interface FloatingLabelInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  validation?: () => boolean;
  rightIcon?: React.ReactNode;
  containerStyle?: object;
  inputStyle?: object;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  value,
  onChangeText,
  placeholder,
  isFocused,
  onFocus,
  onBlur,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  validation,
  rightIcon,
  containerStyle,
  inputStyle,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused || value.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 8],
  });
  const labelLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelFontSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textMuted, Colors.gradientStart],
  });

  const isValid = validation ? validation() : false;
  const borderColor = isFocused
    ? Colors.gradientStart
    : (isValid && value.length > 0 ? Colors.gradientStart : Colors.textPrimary);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.inputContainer, { borderColor }, containerStyle]}
      onPress={onFocus}
    >
      <Animated.Text
        style={[
          styles.floatingLabel,
          {
            top: labelTop,
            fontSize: labelFontSize,
            color: labelColor,
            left: labelLeft,
          },
        ]}
      >
        {placeholder}
      </Animated.Text>
      <TextInput
        style={[styles.input, inputStyle, !!rightIcon && { paddingRight: 50 }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        placeholder=""
        placeholderTextColor={Colors.textMuted}
      />
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

// ---------- MAIN COMPONENT ----------
export default function SignUp() {
  const router = useRouter();

  // ---------- STEP STATE ----------
  const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=Password, 4=AltEmail, 5=Username

  // ---------- FORM FIELDS ----------
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [altEmail, setAltEmail] = useState('');
  const [username, setUsername] = useState('');

  // ---------- FOCUS STATES (fixed type) ----------
  const [focusedField, setFocusedField] = useState<null | 'email' | 'password' | 'altEmail' | 'username'>(null);

  // ---------- UI STATE ----------
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ---------- REFS ----------
  const otpInputRef = useRef<TextInput>(null);

  // ---------- PROGRESS ANIMATION ----------
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  const getProgressForStep = (s: number) => s * 0.2;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: getProgressForStep(step),
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // ---------- STEP HANDLERS ----------
  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 1) {
      if (!email.includes('@')) {
        setError('Enter a valid college email');
        return;
      }
      setError('');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 800);
      return;
    }

    if (step === 2) {
      if (otp.length !== 6) {
        setError('Enter the 6‑digit OTP');
        return;
      }
      setError('');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 800);
      return;
    }

    if (step === 3) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setError('');
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!altEmail.includes('@')) {
        setError('Enter a valid alternative email');
        return;
      }
      setError('');
      setStep(5);
      return;
    }

    if (step === 5) {
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      setError('');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/home');
      }, 800);
    }
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) setStep(step - 1);
  };

  // ---------- VALIDATION HELPERS ----------
  const isEmailValid = () => email.includes('@');
  const isPasswordValid = () => password.length >= 6;
  const isAltEmailValid = () => altEmail.includes('@');
  const isUsernameValid = () => username.length >= 3;

  // ---------- RENDER FUNCTIONS ----------
  const renderEmailStep = () => (
    <>
      <Text style={[Typography.test2, styles.title]}>Create Your Account</Text>
      <Text style={[Typography.h3, styles.additionalText]}>
        Kindly enter <Text style={styles.highlight}>College Email ID</Text>. As it helps us verify your identity
      </Text>

      <FloatingLabelInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        placeholder="Enter your email ID"
        isFocused={focusedField === 'email'}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        validation={isEmailValid}
        containerStyle={{ marginBottom: 50 }}
      />
    </>
  );

  const renderOtpStep = () => (
    <>
      <Text style={[Typography.h2, styles.stepTitle]}>Verify Your Email</Text>
      <Text style={[Typography.h3, styles.additionalText]}>
        We sent a 6‑digit OTP to <Text style={styles.highlight}>{email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        <TextInput
          ref={otpInputRef}
          style={styles.otpHiddenInput}
          value={otp}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, '').slice(0, 6);
            setOtp(digits);
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus={true}
          textContentType="oneTimeCode"
        />
        <View style={styles.otpBoxes}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                otp.length > index && styles.otpBoxFilled,
                otp.length === index && styles.otpBoxActive,
              ]}
            >
              <Text style={styles.otpBoxText}>{otp[index] || ''}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.otpTapArea}
          onPress={() => otpInputRef.current?.focus()}
          activeOpacity={1}
        />
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={[Typography.h2, styles.stepTitle]}>Create Password</Text>
      <Text style={[Typography.h3, styles.additionalText]}>
        Make it strong – at least 6 characters
      </Text>

      <FloatingLabelInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError('');
        }}
        placeholder="Enter your password"
        isFocused={focusedField === 'password'}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        validation={isPasswordValid}
        containerStyle={{ marginBottom: 50 }}
      />
    </>
  );

  const renderAltEmailStep = () => (
    <>
      <Text style={[Typography.h2, styles.stepTitle]}>Backup Email</Text>
      <Text style={[Typography.h3, styles.additionalText]}>
        Enter an alternative email for account recovery
      </Text>

      <FloatingLabelInput
        value={altEmail}
        onChangeText={(text) => {
          setAltEmail(text);
          if (error) setError('');
        }}
        placeholder="your-backup@example.com"
        isFocused={focusedField === 'altEmail'}
        onFocus={() => setFocusedField('altEmail')}
        onBlur={() => setFocusedField(null)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        validation={isAltEmailValid}
        containerStyle={{ marginBottom: 50 }}
      />
    </>
  );

  const renderUsernameStep = () => {
    const tickIcon = isUsernameValid() ? (
      <View style={styles.tickContainer}>
        <Text style={styles.tickText}>✓</Text>
      </View>
    ) : null;

    return (
      <>
        <Text style={[Typography.h2, styles.stepTitle]}>Choose Username</Text>
        <Text style={[Typography.h3, styles.additionalText]}>
          This will be your public profile name
        </Text>

        <FloatingLabelInput
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (error) setError('');
          }}
          placeholder="Your unique username"
          isFocused={focusedField === 'username'}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="none"
          autoCorrect={false}
          validation={isUsernameValid}
          rightIcon={tickIcon}
          containerStyle={{ marginBottom: 50 }}
        />
      </>
    );
  };

  // ---------- STEP CONTENT RENDERER (FIX: define this function) ----------
  const renderStepContent = () => {
    switch (step) {
      case 1: return renderEmailStep();
      case 2: return renderOtpStep();
      case 3: return renderPasswordStep();
      case 4: return renderAltEmailStep();
      case 5: return renderUsernameStep();
      default: return null;
    }
  };

  // ---------- BUTTON TEXT & LOGIC ----------
  const getButtonText = () => {
    switch (step) {
      case 1: return 'Continue';
      case 2: return 'Verify OTP';
      case 3: return 'Set Password';
      case 4: return 'Continue';
      case 5: return 'Finish';
      default: return 'Continue';
    }
  };

  // ---------- MAIN RENDER ----------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER FRAME with progress bar */}
      <View style={styles.headerFrame}>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          // Dismiss keyboard when tapping outside
          if (step === 2) otpInputRef.current?.blur();
          else setFocusedField(null);
        }}
      >
        <View style={styles.content}>
          {renderStepContent()}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Continue / Verify / Finish Button */}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={Typography.button}>{getButtonText()}</Text>
            )}
          </TouchableOpacity>

          {/* Conditional Footer: Login Row (Step 1) or Back Button (Steps 2–5) */}
          {step === 1 ? (
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already a user?</Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.backButton}
              onPress={goBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ---------- STYLES (unchanged) ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
  },
  headerFrame: {
    backgroundColor: '#161a1d',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    height: 85,
    justifyContent: 'flex-end',
    paddingBottom: 1,
    marginHorizontal: -10,
    overflow: 'hidden',
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgb(13, 71, 67)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.gradientStart,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  title: {
    marginBottom: 8,
    marginTop: 20,
    paddingVertical: 20,
  },
  stepTitle: {
    marginBottom: 8,
    marginTop: 20,
    paddingVertical: 10,
  },
  additionalText: {
    marginBottom: 12,
    marginTop: 8,
    color: Colors.textSecondary,
  },
  highlight: {
    color: '#10DBB6',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0.68,
    borderRadius: 16,
    height: 68,
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 10,
    color: Colors.textPrimary,
    fontFamily: 'NeutralSans-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    left: 18,
    fontFamily: 'NeutralSans-Regular',
    backgroundColor: Colors.background,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5C5C',
    fontFamily: 'OakSans-Regular',
    fontSize: 13,
    marginTop: -40,
    marginBottom: 30,
    marginLeft: 16,
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  loginText: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  loginButton: {
    borderWidth: 0.92,
    borderColor: Colors.textSecondary,
    borderRadius: 30,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    marginTop: 12,
    width: '96%',
  },
  loginButtonText: {
    fontFamily: 'OakSans-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: 'Onest_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: 50,
    alignItems: 'center',
    position: 'relative',
  },
  otpHiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 1,
  },
  otpBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBox: {
    width: 44,
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  otpBoxFilled: {
    borderColor: Colors.gradientStart,
  },
  otpBoxActive: {
    borderColor: Colors.gradientStart,
    borderWidth: 2,
  },
  otpBoxText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  otpTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});