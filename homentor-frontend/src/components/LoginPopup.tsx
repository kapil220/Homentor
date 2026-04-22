import React, { useState } from 'react';
import { X, Phone } from 'lucide-react';
import axios from 'axios';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setPendingAction: (x) => void;
  pendingAction: {
    type: string
  }
}

type Mode = 'login' | 'signup';

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, setPendingAction, pendingAction }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetAndClose = () => {
    setMode('login');
    setPhoneNumber('');
    setPassword('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (phoneNumber.length !== 10) {
      setErrorMsg('Enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        { mobile: phoneNumber, password, userType: 'student' }
      );

      if (res.data?.success) {
        localStorage.setItem('usernumber', phoneNumber);
        onClose();
        if (pendingAction?.type === 'payment') {
          setPendingAction({ type: 'PAYMENT' });
        } else if (pendingAction?.type === 'call') {
          setPendingAction({ type: 'CALL' });
        }
      } else {
        setErrorMsg(res.data?.message || 'Something went wrong');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-[500000] w-[100vw] top-0 left-0 h-[100vh] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'signup' ? 'Sign up' : 'Login'}
              </h2>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="lg:p-6 p-3 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Create a password' : 'Enter password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isLoading
              ? mode === 'signup' ? 'Creating account...' : 'Logging in...'
              : mode === 'signup' ? 'Sign Up' : 'Login'}
          </button>

          <p className="text-sm text-center text-gray-600">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
