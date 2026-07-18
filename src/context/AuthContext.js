// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// 1. Create the Context (a shared box for user data)
const AuthContext = createContext();

// 2. Create the Provider (the component that wraps your app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = nobody logged in
  const [loading, setLoading] = useState(true); // true while we check if user exists

  // 3. This runs automatically when the app starts
  useEffect(() => {
    // Check if there is an active session on the phone (from last time)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user); // Found a saved user -> log them in
      }
      setLoading(false); // Done checking
    });

    // 4. Listen for any future login/logout events (from other tabs or windows)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null); // User logged out
      }
      setLoading(false);
    });

    // Cleanup the listener when the app unmounts
    return () => listener?.subscription.unsubscribe();
  }, []);

  // 5. The "Sign Up" function (calls real Supabase) - now also takes a username
  const signUp = async (email, password, username) => {
    // Check username uniqueness BEFORE creating the auth user (fast UX feedback)
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
      throw new Error('That username is already taken.');
    }

    // Create the auth user, passing username as metadata so the DB trigger
    // (handle_new_user) can read it via raw_user_meta_data and create the
    // profiles row automatically — no manual insert needed here.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) throw error;

    return data;
  };

  // 6. The "Login" function (calls real Supabase)
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // 7. The "Logout" function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // 8. Provide all these functions and data to the rest of the app
  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. Custom hook: A shortcut so you don't have to type useContext(AuthContext) everywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};