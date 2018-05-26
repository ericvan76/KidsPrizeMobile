import { Fingerprint } from 'expo';
import { Platform } from 'react-native';

export async function hasFingerprintEnrolledAsync(): Promise<boolean> {
  if (Platform.OS === 'android') {
    // Finerprint is currently not available on Android
    return false;
  }
  const hasHardware = await Fingerprint.hasHardwareAsync();
  const enrolled = await Fingerprint.isEnrolledAsync();
  return hasHardware && enrolled;
}

export async function validateFingerprintAsync(): Promise<boolean> {
  if (Platform.OS === 'android') {
    // Finerprint is currently not available on Android
    return true;
  }
  if (await hasFingerprintEnrolledAsync()) {
    const result: Fingerprint.FingerprintAuthenticationResult = await Fingerprint.authenticateAsync('Use Touch ID to SignIn');
    if (result.success) {
      return true;
    }
  }
  return false;
}
