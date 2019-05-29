import { LocalAuthentication } from 'expo';

export async function hasFingerprintEnrolledAsync(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && enrolled;
}

export async function validateFingerprintAsync(): Promise<boolean> {
  if (await hasFingerprintEnrolledAsync()) {
    const result = await LocalAuthentication.authenticateAsync('Use Touch ID to sign in');
    if (result.success) {
      return true;
    }
  }
  return false;
}
