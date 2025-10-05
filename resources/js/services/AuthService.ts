import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

/**
 * Professional Firebase Authentication Service
 * Centralized authentication operations with proper error handling
 */
export class AuthService {
  
  /**
   * Sign in user with email and password
   */
  static async signIn(email: string, password: string): Promise<{
    user: User;
    success: boolean;
    message: string;
  }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        return {
          user,
          success: false,
          message: 'Please verify your email address before signing in. Check your inbox for the verification link.'
        };
      }

      return {
        user,
        success: true,
        message: 'Successfully signed in!'
      };

    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase auth errors
      let message = 'Sign in failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        message = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }

      throw new Error(message);
    }
  }

  /**
   * Sign up user with email and password
   */
  static async signUp(email: string, password: string): Promise<{
    user: User;
    emailSent: boolean;
    message: string;
  }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      return {
        user,
        emailSent: true,
        message: 'Account created successfully! Please check your email for verification link.'
      };

    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let message = 'Account creation failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters with letters and numbers.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }

      throw new Error(message);
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<string> {
    try {
      await sendPasswordResetEmail(auth, email);
      return 'Password reset email sent! Please check your inbox.';
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let message = 'Failed to send password reset email.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }

      throw new Error(message);
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(user: User): Promise<string> {
    try {
      await sendEmailVerification(user);
      return 'Verification email sent! Please check your inbox.';
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  /**
   * Get user info (for demo purposes in virtual card dashboard)
   * This method returns a simplified user object for demonstration
   */
  static getCurrentUserInfo(): { email: string; name?: string } | null {
    const user = this.getCurrentUser();
    if (user) {
      return {
        email: user.email || '',
        name: user.displayName || undefined
      };
    }
    
    // For demo purposes, return a mock user if no authenticated user exists
    // In production, this would be removed
    return {
      email: 'demo@example.com',
      name: 'Demo User'
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): { isValid: boolean; message?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }
    
    return { isValid: true };
  }
}