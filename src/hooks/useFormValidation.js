import React, { useState } from 'react';
import Filter from 'bad-words';

const customBadWords = [
  'spam', 'küfür', 'hakaret', 'lanet', 'aptal', 'salak', 'gerizekalı', 'ahmak', 'dangalak', 'eşek', 'it', 'şerefsiz', 'namussuz', 'ahlaksız', 'terbiyesiz', 'yavşak', 'pezevenk', 'gavat', 'ibne', 'orospu', 'kahpe', 'sürtük', 'amcık', 'yarrak', 'sik', 'göt', 'meme', 'kaltak', 'zibidi', 'hıyar', 'dallama', 'kevaşe', 'puşt', 'fuck', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'motherfucker', 'bastard', 'slut', 'whore', 'mal', 'öküz', 'hayvan', 'piç', 'yelloz', 'godoş', 'lavuk', 'kavat', 'dümbelek', 'kerhane', 'genelev'
];
const filter = new Filter();
filter.addWords(...customBadWords);

export const useFormValidation = (formData, acceptTerms, isLogin = false) => {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value, allFormData = {}) => {
    const fieldErrors = {};

    switch (name) {
      case 'name':
        if (!isLogin) {
            const trimmedValue = value ? value.trim() : '';
            if (!trimmedValue) {
                fieldErrors.name = 'Ad Soyad gereklidir';
            } else if (trimmedValue.length < 2) {
                fieldErrors.name = 'Ad Soyad en az 2 karakter olmalıdır';
            } else if (trimmedValue.length > 50) {
                fieldErrors.name = 'Ad Soyad 50 karakterden kısa olmalıdır';
            } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(trimmedValue)) {
                fieldErrors.name = 'Ad Soyad sadece harf ve boşluk içerebilir';
            } else if (filter.isProfane(trimmedValue)) {
                fieldErrors.name = 'Geçersiz ad veya soyad.';
            } else if (/(.)\1{3,}/.test(trimmedValue)) {
                fieldErrors.name = 'Geçersiz ad veya soyad.';
            } else if (/\s{2,}/.test(value)) {
                fieldErrors.name = 'Geçersiz ad veya soyad.';
            }
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          fieldErrors.email = 'E-posta adresi gereklidir';
        } else if (!emailRegex.test(value)) {
          fieldErrors.email = 'Geçerli bir e-posta adresi girin';
        } else if (value.length > 255) {
          fieldErrors.email = 'E-posta adresi çok uzun';
        }
        break;

      case 'password':
        if (!value) {
          fieldErrors.password = 'Şifre gereklidir';
        } else if (!isLogin) {
          if (value.length < 8) {
            fieldErrors.password = 'Şifre en az 8 karakter olmalıdır';
          } else if (value.length > 128) {
            fieldErrors.password = 'Şifre 128 karakterden uzun olamaz';
          } else if (!/(?=.*[a-z])/.test(value)) {
            fieldErrors.password = 'Şifre en az bir küçük harf içermelidir';
          } else if (!/(?=.*[A-Z])/.test(value)) {
            fieldErrors.password = 'Şifre en az bir büyük harf içermelidir';
          } else if (!/(?=.*\d)/.test(value)) {
            fieldErrors.password = 'Şifre en az bir rakam içermelidir';
          } else if (/(.)\1{2,}/.test(value)) {
            fieldErrors.password = 'Şifre art arda 3 aynı karakter içeremez';
          } else if (/^[0-9]+$/.test(value)) {
            fieldErrors.password = 'Şifre sadece rakamlardan oluşamaz';
          } else if (/^[a-zA-Z]+$/.test(value)) {
            fieldErrors.password = 'Şifre sadece harflerden oluşamaz';
          }
          
          const weakPasswords = [
            '12345678', 'password', 'Password', 'PASSWORD', 'password123', 'Password123',
            '123456789', 'qwerty123', 'Qwerty123', 'abc12345', 'Abc12345', 'abcd1234',
            'Abcd1234', '11111111', '00000000', 'asdf1234', 'Asdf1234', 'qwertyui',
            'Qwertyui', 'zxcvbnm1', 'Zxcvbnm1', 'admin123', 'Admin123', 'user1234',
            'User1234', 'test1234', 'Test1234', 'welcome1', 'Welcome1', 'password1',
            'Password1', 'letmein1', 'Letmein1', 'monkey12', 'Monkey12', 'dragon12',
            'Dragon12', 'sunshine', 'Sunshine', 'princess', 'Princess'
          ];
          
          if (weakPasswords.some(weak => value.toLowerCase().includes(weak.toLowerCase()))) {
            fieldErrors.password = 'Bu şifre çok yaygın kullanılıyor, daha güvenli bir şifre seçin';
          }
          
          const commonPatterns = [
            /123456/,
            /abcdef/,
            /qwerty/,
            /asdfgh/,
            /zxcvbn/,
            /654321/,
            /fedcba/
          ];
          
          if (commonPatterns.some(pattern => pattern.test(value.toLowerCase()))) {
            fieldErrors.password = 'Şifre yaygın karakter dizileri içeremez';
          }
        }
        break;

      case 'confirmPassword':
        if (!isLogin) {
          if (!value) {
            fieldErrors.confirmPassword = 'Şifre doğrulaması gereklidir';
          } else if (value !== allFormData.password) {
            fieldErrors.confirmPassword = 'Şifreler eşleşmiyor';
          }
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  };
  
  const validateAllFields = () => {
    const allErrors = {};
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field], formData);
      Object.assign(allErrors, fieldErrors);
    });

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const isFormValid = () => {
    const allErrors = {};
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field], formData);
      Object.assign(allErrors, fieldErrors);
    });

    if (isLogin) {
      return formData.email && formData.password && Object.keys(allErrors).length === 0;
    }
    
    const termsAcceptedResult = acceptTerms || false;
    return formData.name && formData.email && formData.password && formData.confirmPassword && Object.keys(allErrors).length === 0 && termsAcceptedResult;
  };

  return {
    errors,
    setErrors,
    validateAllFields,
    isFormValid,
    submitted,
    setSubmitted,
  };
};