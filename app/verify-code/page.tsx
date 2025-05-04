'use client'
import React, { useEffect, useState } from 'react';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const Page = () => {
  const [code, setCode] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const { signUp } = useSignUp();
  const [email, setEmail] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/';
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('emailForVerification');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/sign-up');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code 
      });
      
      if (signUpAttempt) {
        toast.success('Verification successful! Redirecting...');
        setTimeout(() => {
          window.location.pathname = '/';
        }, 2000);
      } else {
        setErr('Unable to connect to internet.');
      }
    } catch (error: any) {
      if (error?.errors) {
        error?.errors.forEach((err: any) => {
          toast.error(err.message || 'An unknown error occurred');
        });
      } else {
        toast.error('An error occurred during verification. Please try again.');
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
                  className="rounded-full object-cover drop-shadow-xl"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rollinks Skincare</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Verify your email</p>
            </div>

            {err && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {err}
              </div>
            )}

            <div className="mb-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                A verification code has been sent to <br />
                <strong className="text-gray-900 dark:text-white">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verification-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center tracking-widest font-mono"
                  placeholder="123456"
                  maxLength={6}
                />
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
                      Verifying...
                    </>
                  ) : 'Verify Code'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Didn't receive a code? <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Resend</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;