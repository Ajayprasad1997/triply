/**
 * Client-Side Security Utilities for Triiply Onboarding Platform
 */

/**
 * XSS Mitigation: Sanitizes user input by encoding HTML special characters.
 * Prevents HTML/JS injection when displaying user-generated content like bios or itinerary descriptions.
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Password Strength Check: Analyzes password entropy and complexity.
 * Returns a score from 0 (very weak) to 4 (strong) and feedback messages.
 */
export interface PasswordStrengthResult {
  score: number;
  feedback: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score, feedback: ['Password is required'] };
  }

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Must be at least 8 characters long');
  }

  // Uppercase letter check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add at least one uppercase letter (A-Z)');
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add at least one number (0-9)');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add at least one special character (e.g. !@#$)');
  }

  return { score, feedback };
};

/**
 * File Size Validation: Checks if file size exceeds the specified limit in MB.
 */
export const validateFileSize = (fileSize: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

/**
 * File MIME Type Validation: Checks if file type is in the allowed whitelist.
 */
export const validateFileType = (fileName: string, allowedExtensions: string[] = ['pdf', 'png', 'jpg', 'jpeg']): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return !!extension && allowedExtensions.includes(extension);
};

/**
 * Brute-Force Mitigation Simulation: Rate limits login requests.
 * Locks the login flow for 30 seconds after 5 failed attempts for a specific email.
 */
interface LockoutState {
  attempts: number;
  lockoutUntil: number;
}

export const trackFailedLogin = (email: string): { locked: boolean; remainingSeconds: number } => {
  const storageKey = `triiply_lockout_${email}`;
  const rawState = localStorage.getItem(storageKey);
  const now = Date.now();

  let state: LockoutState = rawState 
    ? JSON.parse(rawState) 
    : { attempts: 0, lockoutUntil: 0 };

  // If currently locked out
  if (state.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((state.lockoutUntil - now) / 1000);
    return { locked: true, remainingSeconds };
  }

  // If lockout expired, reset attempts
  if (state.lockoutUntil > 0 && state.lockoutUntil <= now) {
    state.attempts = 0;
    state.lockoutUntil = 0;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  return { locked: false, remainingSeconds: 0 };
};

export const registerFailedLoginAttempt = (email: string): { locked: boolean; remainingSeconds: number } => {
  const storageKey = `triiply_lockout_${email}`;
  const rawState = localStorage.getItem(storageKey);
  const now = Date.now();

  let state: LockoutState = rawState 
    ? JSON.parse(rawState) 
    : { attempts: 0, lockoutUntil: 0 };

  state.attempts += 1;

  if (state.attempts >= 5) {
    state.lockoutUntil = now + 30000; // 30 seconds lockout
    localStorage.setItem(storageKey, JSON.stringify(state));
    return { locked: true, remainingSeconds: 30 };
  }

  localStorage.setItem(storageKey, JSON.stringify(state));
  return { locked: false, remainingSeconds: 0 };
};

export const resetFailedLoginAttempts = (email: string): void => {
  const storageKey = `triiply_lockout_${email}`;
  localStorage.removeItem(storageKey);
};

/**
 * UI session metadata. Authorization is always validated by the backend's
 * HTTP-only session cookie; this value only supports synchronous UI state.
 */
const UI_SESSION_KEY = 'triiply_ui_session';

export const createSecureSession = (userId: string, role: 'agency' | 'admin', email: string): string => {
  const payload = {
    userId,
    role,
    email,
    exp: Date.now() + 3600000 // 1 hour session
  };
  
  const jsonStr = JSON.stringify(payload);
  const encoded = btoa(encodeURIComponent(jsonStr));
  sessionStorage.setItem(UI_SESSION_KEY, encoded);
  localStorage.removeItem('triiply_session_token');
  localStorage.removeItem('triiply_jwt_token');
  return encoded;
};

export const getSecureSession = (): { userId: string; role: 'agency' | 'admin'; email: string } | null => {
  const token = sessionStorage.getItem(UI_SESSION_KEY);
  if (!token) return null;

  try {
    const decodedStr = decodeURIComponent(atob(token));
    const payload = JSON.parse(decodedStr);
    
    // Check expiration
    if (Date.now() > payload.exp) {
      clearSecureSession();
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
      email: payload.email
    };
  } catch (error) {
    clearSecureSession();
    return null;
  }
};

export const clearSecureSession = (): void => {
  sessionStorage.removeItem(UI_SESSION_KEY);
  localStorage.removeItem('triiply_session_token');
  localStorage.removeItem('triiply_jwt_token');
};
