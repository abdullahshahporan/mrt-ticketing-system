// Firebase Configuration for Email Authentication
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, updateProfile, User } from 'firebase/auth';

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2u3NOk9-BB_0Hk7bjYlnEsw4rNaQu_6s",
    authDomain: "mrt-ticketing-system-88070.firebaseapp.com",
    projectId: "mrt-ticketing-system-88070",
    storageBucket: "mrt-ticketing-system-88070.firebasestorage.app",
    messagingSenderId: "897580379577",
    appId: "1:897580379577:web:f59d408efdafd869dc5a68",
    //measurementId: "G-4F45L45HB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    await sendEmailVerification(user);
    
    console.log('User created successfully:', user.uid);
    return {
      user,
      emailSent: true
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('email-already-in-use')) {
        throw new Error('This email is already registered. Please use a different email or sign in.');
      } else if (error.message.includes('weak-password')) {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.message.includes('invalid-email')) {
        throw new Error('Please enter a valid email address.');
      }
    }
    
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('user-not-found')) {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.message.includes('wrong-password')) {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.message.includes('invalid-email')) {
        throw new Error('Please enter a valid email address.');
      }
    }
    
    throw error;
  }
};

// Resend email verification
export const resendEmailVerification = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
