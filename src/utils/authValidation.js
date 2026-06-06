export const validateRegistrationData = (name, email, password) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Ad Soyad en az 2 karakter olmalıdır.');
  }

  if (name && name.trim().length > 100) {
    errors.push('Ad Soyad 100 karakterden uzun olamaz.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin.');
  }

  if (email && email.length > 255) {
    errors.push('E-posta adresi çok uzun.');
  }

  if (!password || password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır.');
  }

  if (password && password.length > 128) {
    errors.push('Şifre 128 karakterden uzun olamaz.');
  }

  if (password && !/(?=.*[a-z])/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir.');
  }

  if (password && !/(?=.*[A-Z])/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir.');
  }

  if (password && !/(?=.*\d)/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir.');
  }

  if (password && /(.)\1{2,}/.test(password)) {
    errors.push('Şifre art arda 3 aynı karakter içeremez.');
  }

  if (password && /^[0-9]+$/.test(password)) {
    errors.push('Şifre sadece rakamlardan oluşamaz.');
  }

  if (password && /^[a-zA-Z]+$/.test(password)) {
    errors.push('Şifre sadece harflerden oluşamaz.');
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
  
  if (password && weakPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
    errors.push('Bu şifre çok yaygın kullanılıyor, daha güvenli bir şifre seçin.');
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
  
  if (password && commonPatterns.some(pattern => pattern.test(password.toLowerCase()))) {
    errors.push('Şifre yaygın karakter dizileri içeremez.');
  }

  return errors;
};

export const handleAuthError = (error) => {
  if (error.message.includes('over_email_send_rate_limit')) {
    const timeMatch = error.message.match(/(\d+)\s*seconds?/);
    const waitTime = timeMatch ? timeMatch[1] : '60';
    return `Güvenlik nedeniyle ${waitTime} saniye sonra tekrar deneyebilirsiniz. Çok fazla kayıt denemesi yaptınız.`;
  } else if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
    return 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
  } else if (error.message.includes('signup is disabled')) {
    return 'Kayıt işlemi şu anda devre dışı. Lütfen daha sonra tekrar deneyin.';
  } else if (error.message.includes('Password should be at least')) {
    return 'Şifreniz en az 8 karakter olmalı ve güvenlik kurallarını karşılamalıdır.';
  } else if (error.message.includes('Invalid email')) {
    return 'Geçerli bir e-posta adresi girin.';
  } else if (error.message.includes('Unable to validate email address')) {
    return 'E-posta adresi doğrulanamadı. Geçerli bir e-posta adresi girin.';
  } else if (error.message.includes('For security purposes')) {
    return 'Güvenlik nedeniyle bir süre bekleyip tekrar deneyiniz. Çok fazla kayıt denemesi yaptınız.';
  } else if (error.message.includes('email rate limit exceeded')) {
    return 'E-posta gönderim limiti aşıldı. Lütfen bir süre bekleyip tekrar deneyin.';
  }
  
  return error.message || 'Bir hata oluştu.';
};