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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 dark:border-gray-700"
      >
        <div className="logo mb-8 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-3 text-gray-900 dark:text-white">
            <Image
              src="/logo.jpg"
              alt="Rollinks Skincare"
              className="rounded-full"
              width={50}
              height={50}
            />
            Rollinks Skincare
          </h1>
          <p className="tracking-widest font-semibold text-lg mt-2 text-gray-700 dark:text-gray-300">
            Welcome Back
          </p>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr((prev) => ({ ...prev, username: '' })); }}
            id="email"
            className="bg-white/30 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-1 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Email"
          />
          {err.email && <p className="text-red-500 text-xs italic">{err.email}</p>}
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { err.password = ''; setPassword(e.target.value); }}
            id="password"
            className="bg-white/30 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-1 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="text-gray-500" size={20} /> : <Eye className="text-gray-500" size={20} />}
          </button>
          {err.password && <p className="text-red-500 text-xs italic">{err.password}</p>}
        </div>

        <Button
          type="submit"
          disabled={isloading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {isloading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="flex justify-between mt-4 text-sm text-gray-700 dark:text-gray-400">
          <span>Forgot password?</span>
          <Link href="/forgot-password" className="underline hover:text-blue-600">
            Reset here
          </Link>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        <div className="text-center text-sm text-gray-700 dark:text-gray-400">
          <span>Don't have an account? </span>
          <Link href="/sign-up" className="underline hover:text-blue-600">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Page;