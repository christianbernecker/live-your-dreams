'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const router = useRouter();
  
  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    // Auto-fill demo credentials with animation
    setEmail('admin@liveyourdreams.online');
    setPassword('admin123');
    
    // Simulate typing effect
    setTimeout(async () => {
      const result = await signIn('credentials', {
        email: 'admin@liveyourdreams.online',
        password: 'admin123',
        redirect: false,
      });
      
      if (result?.error) {
        setError('Demo-Zugang konnte nicht geladen werden');
        setLoading(false);
      } else {
        // Success animation
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (step === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        if (result?.error) {
          if (result.error === '2FA_REQUIRED') {
            setStep('2fa');
          } else {
            setError('Ungültige Anmeldedaten');
          }
        } else {
          router.push('/dashboard');
        }
      } else {
        // Handle 2FA verification
        const result = await signIn('credentials', {
          email,
          password,
          totpCode,
          redirect: false,
        });
        
        if (result?.error) {
          setError('Ungültiger 2FA-Code');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('Anmeldefehler aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Live Your Dreams
              </h1>
              <p className="text-white/60 text-sm">
                {step === 'login' ? 'Backoffice Anmeldung' : 'Zwei-Faktor-Authentifizierung'}
              </p>
            </motion.div>

            {/* Step Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className={clsx(
                'w-2 h-2 rounded-full transition-all duration-300',
                step === 'login' ? 'bg-blue-500 w-6' : 'bg-white/30'
              )} />
              <div className={clsx(
                'w-2 h-2 rounded-full transition-all duration-300',
                step === '2fa' ? 'bg-blue-500 w-6' : 'bg-white/30'
              )} />
            </div>
          </div>

          {/* Demo Banner */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showDemo ? 'auto' : 0, 
              opacity: showDemo ? 1 : 0 
            }}
            className="overflow-hidden mx-8"
          >
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white/90 font-medium mb-1">Demo-Zugang verfügbar</p>
                  <p className="text-white/70 text-xs">
                    <strong>E-Mail:</strong> admin@liveyourdreams.online<br/>
                    <strong>Passwort:</strong> admin123
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <div className="px-8 pb-8">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: step === '2fa' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === '2fa' ? -50 : 50 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {step === 'login' ? (
                <>
                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="E-Mail Adresse eingeben"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Passwort eingeben"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/40 hover:text-white/60" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/40 hover:text-white/60" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 2FA Code Field */}
                  <div className="text-center mb-6">
                    <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-white/80 text-sm">
                      Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein
                    </p>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setTotpCode(value);
                      }}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      autoComplete="off"
                      inputMode="numeric"
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
                >
                  <p className="text-red-200 text-sm text-center">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                {step === '2fa' && (
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="w-full py-3 px-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm"
                    disabled={loading}
                  >
                    ← Zurück zur Anmeldung
                  </button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || (step === 'login' && (!email || !password)) || (step === '2fa' && totpCode.length !== 6)}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{step === 'login' ? 'Anmelden...' : 'Verifizieren...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>{step === 'login' ? 'Anmelden' : 'Code verifizieren'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {step === 'login' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="w-full py-4 px-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Demo-Zugang testen</span>
                  </motion.button>
                )}
              </div>
            </motion.form>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center space-y-4"
        >
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="text-white/60 hover:text-white/80 text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Demo-Zugangsdaten {showDemo ? 'ausblenden' : 'anzeigen'}
          </button>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL verschlüsselt • DSGVO-konform</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}