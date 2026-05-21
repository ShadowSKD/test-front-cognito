import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AuthContext } from '../../context/AuthContext';
import { signIn, confirmSignUp } from 'aws-amplify/auth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: formData.username,
        password: formData.password,
      });

      if (isSignedIn) {
        await login();
        navigate('/');
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setIsVerifying(true);
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setError('New password required. Please contact administrator.');
      } else {
        setError(`Additional authentication step required: ${nextStep?.signInStep}`);
      }
    } catch (err) {
      if (err.name === 'UserNotConfirmedException') {
        setIsVerifying(true);
      } else {
        setError(err.message || 'Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await confirmSignUp({
        username: formData.username,
        confirmationCode: verificationCode
      });
      
      // Verification successful, automatically sign them in
      const { isSignedIn } = await signIn({
        username: formData.username,
        password: formData.password,
      });
      
      if (isSignedIn) {
        await login();
        navigate('/');
      } else {
        setError('Verification successful. Please sign in again.');
        setIsVerifying(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

  // For Demo purposes
  const handleDemoLogin = () => {
    login({ id: 1, username: 'demo_user', role: 'CUSTOMER', name: 'Demo User' }, 'dummy_jwt_token_123');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
        <Package className="text-primary" size={32} />
        <span>Equi<span className="text-primary">Cart</span></span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-textSecondary">Sign in to your enterprise dashboard</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {isVerifying ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center mb-6">
                <p className="text-textSecondary text-sm">
                  Please check your email for a verification code to confirm your account.
                </p>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                <Input
                  type="text"
                  placeholder="Verification Code"
                  className="pl-12 tracking-widest text-center font-mono"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsVerifying(false)} 
                  className="text-sm text-textSecondary hover:text-white underline decoration-white/30 underline-offset-4"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username or Email"
                    className="pl-12"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-12"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/10 bg-surface text-primary focus:ring-primary focus:ring-offset-background" />
                    <span className="text-textSecondary">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-primary hover:text-orange-400">Forgot password?</Link>
                </div>

                <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={handleDemoLogin} className="text-sm text-textSecondary hover:text-white underline decoration-white/30 underline-offset-4">
                  Use Demo Admin Account
                </button>
              </div>

              <p className="text-center text-textSecondary text-sm mt-8">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-orange-400 font-medium">
                  Create one
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
