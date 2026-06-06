import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import RememberMeCheckbox from './RememberMeCheckbox';
import TermsCheckbox from './TermsCheckbox';

const AuthForm = ({
  isLogin,
  formData,
  onInputChange,
  acceptTerms,
  setAcceptTerms,
  rememberMe,
  setRememberMe,
  loading,
  onSubmit,
  errors,
  emailWarning,
  submitted
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const showError = (fieldName) => submitted && errors[fieldName];

  const getFieldValidationIcon = (fieldName, value, error) => {
    if (fieldName === 'email' && emailWarning?.exists) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (submitted && error) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (value && !error && !isLogin && submitted) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2" autoComplete={isLogin ? "on" : "off"} noValidate>
      <AnimatePresence mode="wait">
        {!isLogin && (
          <motion.div 
            key="name-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1 overflow-hidden"
          >
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Ad Soyad
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                type="text"
                placeholder="Adınız ve soyadınız"
                value={name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className={`pl-10 pr-10 h-10 text-sm border-2 transition-all duration-300 bg-background/50 ${
                  showError('name') ? 'border-destructive' : 'border-muted focus:border-primary'
                }`}
                required={!isLogin}
                disabled={loading}
                autoComplete="name"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldValidationIcon('name', name, errors?.name)}
              </div>
            </div>
            {showError('name') && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.name}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="space-y-1"
        layout
      >
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          E-posta Adresi
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`pl-10 pr-10 h-10 text-sm border-2 transition-all duration-300 bg-background/50 ${
              showError('email') || (submitted && emailWarning?.exists) ? 'border-destructive' : 'border-muted focus:border-primary'
            }`}
            required
            disabled={loading}
            autoComplete="email"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldValidationIcon('email', email, errors?.email)}
          </div>
        </div>
        {(showError('email') || (submitted && emailWarning?.exists)) && (
          <p className="text-xs text-destructive flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors?.email || emailWarning?.message}
          </p>
        )}
      </motion.div>

      <motion.div 
        className="space-y-1"
        layout
      >
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">
          Şifre
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={isLogin ? "••••••••" : "En az 8 karakter, büyük/küçük harf ve rakam"}
            value={password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`pl-10 pr-16 h-10 text-sm border-2 transition-all duration-300 bg-background/50 ${
              showError('password') ? 'border-destructive' : 'border-muted focus:border-primary'
            }`}
            required
            disabled={loading}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldValidationIcon('password', password, errors?.password)}
          </div>
        </div>
        {showError('password') && !isLogin && (
          <p className="text-xs text-destructive flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.password}
          </p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!isLogin && (
          <motion.div 
            key="confirm-password-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1 overflow-hidden"
          >
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
              Şifre Tekrarı
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                className={`pl-10 pr-16 h-10 text-sm border-2 transition-all duration-300 bg-background/50 ${
                  showError('confirmPassword') ? 'border-destructive' : 'border-muted focus:border-primary'
                }`}
                required={!isLogin}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldValidationIcon('confirmPassword', confirmPassword, errors?.confirmPassword)}
              </div>
            </div>
            {showError('confirmPassword') && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="space-y-2 pt-1">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="remember-me"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <RememberMeCheckbox 
                checked={rememberMe} 
                onCheckedChange={setRememberMe}
                disabled={loading}
              />
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Şifremi unuttum
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TermsCheckbox 
                checked={acceptTerms} 
                onCheckedChange={setAcceptTerms}
                disabled={loading}
                isInvalid={submitted && !acceptTerms}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.div layout className="pt-1">
        <Button 
          type="submit" 
          className={`w-full h-10 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 group ${
            isLogin 
              ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
              : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
          }`}
          disabled={loading}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
                {isLogin ? 'Giriş yapılıyor...' : 'Hesap oluşturuluyor...'}
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </form>
  );
};

export default AuthForm;