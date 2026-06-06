import { useState } from 'react';
import { checkEmailExistsViaRPC, checkEmailExistsInSupabase } from '@/utils/authHelpers';

export const useEmailValidation = () => {
  const [emailWarning, setEmailWarning] = useState({
    exists: false,
    message: '',
    loading: false
  });

  const checkEmailAvailability = async (emailToCheck) => {
    if (!emailToCheck || emailToCheck.length < 3) {
      setEmailWarning({ exists: false, message: '', loading: false });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) {
      setEmailWarning({ exists: false, message: '', loading: false });
      return;
    }

    setEmailWarning(prev => ({ ...prev, loading: true }));
    
    try {
      let exists = false;
      try {
        exists = await checkEmailExistsViaRPC(emailToCheck);
      } catch (rpcError) {
        console.warn('RPC check failed, falling back to profiles check:', rpcError);
        try {
          exists = await checkEmailExistsInSupabase(emailToCheck);
        } catch (fallbackError) {
          console.error('Fallback email check failed:', fallbackError);
        }
      }

      setEmailWarning({
        exists,
        message: exists ? 'Bu e-posta adresi zaten kullanımda' : '',
        loading: false
      });
    } catch (error) {
      console.error('Error checking email availability:', error);
      setEmailWarning({ exists: false, message: '', loading: false });
    }
  };

  return { emailWarning, checkEmailAvailability };
}