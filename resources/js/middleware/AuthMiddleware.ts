import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Firebase Authentication Middleware
 * Handles authentication state and user session management
 */
export class AuthMiddleware {
  private static currentUser: User | null = null;
  private static authListeners: Array<(user: User | null) => void> = [];

  /**
   * Initialize authentication listener
   */
  static init(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.notifyListeners(user);
        unsubscribe(); // Resolve only once
        resolve(user);
      });
    });
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.emailVerified;
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current user email
   */
  static getCurrentUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  /**
   * Check if user email is verified
   */
  static isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of auth state change
   */
  private static notifyListeners(user: User | null): void {
    this.authListeners.forEach(callback => callback(user));
  }

  /**
   * Require authentication - throws error if not authenticated
   */
  static requireAuth(): User {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    return this.currentUser!;
  }

  /**
   * Require verified email - throws error if email not verified
   */
  static requireVerifiedEmail(): User {
    const user = this.requireAuth();
    if (!this.isEmailVerified()) {
      throw new Error('Email verification required');
    }
    return user;
  }
}