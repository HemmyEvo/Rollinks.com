'use client';

import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState({ email: '', password: '' });
  const { signIn, isLoaded } = useSignIn();
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErr = { email: '', password: '' };  
    let hasErrors = false;  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(email.trim())) {  
      newErr.email = 'Please enter a valid email address';  
      hasErrors = true;  
    }  

    if (password.trim().length < 8) {  
      newErr.password = 'Password must be at least 8 characters long';  
      hasErrors = true;  
    }  

    setErr(newErr);  

    if (hasErrors) {  
      return setIsLoading(false);  
    }  

    try {  
      const attemptSignIn = await signIn?.create({  
        identifier: email,  
        password: password,  
      });  
      if (attemptSignIn) {  
        toast.success('Login successful! Redirecting...');  
        setTimeout(() => {  
          window.location.pathname = '/';  
        }, 2000);  
      } else {  
        toast.error('Unable to connect to internet.');  
      }  
    } catch (error: any) {  
      if (error?.errors) {  
        error.errors.forEach((err: any) => {  
          toast.error(err.message || 'An unknown error occurred');  
        });  
      } else {  
        toast.error('An error occurred during sign-up. Please try again.');  
      }  
    } finally {  
      setIsLoading(false);  
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/30 dark:bg-black/30 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-1 border border-white/30 flex items-center justify-center mb-4">
                <Image 
                  src="/logo.jpg" 
                  alt="Rollinks Skincare" 
                  width={64} 
                  height={64} 
                  className="rounded-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rollinks Skincare</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr((prev) => ({ ...prev, email: '' })); }}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
                {err.email && <p className="mt-1 text-sm text-red-500">{err.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErr((prev) => ({ ...prev, password: '' })); }}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {err.password && <p className="mt-1 text-sm text-red-500">{err.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isloading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                >
                  {isloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/30 dark:bg-black/30 backdrop-blur-sm text-gray-500 dark:text-gray-400 rounded-full">
                    New to Rollinks?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/sign-up"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-700/70 transition-all duration-200"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;