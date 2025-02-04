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
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  // Redirect if authenticated
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/');
      // Redirect to home page if user is signed in
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    const newErr = { email: '', password: '' };
    let hasErrors = false;

    // Validation
    // Validate each field
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
        // Show success toast
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
    <div className="flex min-h-screen  items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-lvw p-4 bg-[#e09d22dc] rounded-[10px] dark:bg-[#202020] shadow-md shadow-[#3b3b3b] mx-auto"
      >
        <div className="logo mb-7 text-center">
          <h1 className="text-xl font-semibold flex items-center justify-center">
            <span>
              <Image src="/logo.jpg" alt="Hemmyevo" className='rounded-full' width={50} height={50} />
            </span>
          </h1>
          <p className="tracking-widest font-[gerald] text-2xl drop-shadow-2xl text-white mt-2 ">Rollinks Skincare</p>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr((prev) => ({ ...prev, username: '' })); }}
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            placeholder="Email"
          />
          {err.email && <p className="text-red-500 text-xs italic">{err.email}</p>}
        </div>

        <div className="mb-5 relative">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { err.password = ''; setPassword(e.target.value); }}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
            </button>
          </div>
          <p className='text-red-500 text-xs italic'>{err.password}</p>
        </div>

        <Button type="submit" disabled={isloading}>{isloading ? 'Signing In...' : 'Sign In'}</Button>
        <p className="text-sm mt-5 text-right ">
          <span>Forgot Password?</span>
          <span><Link className='text-sm underline text-blue-800' href="/forgot-password"> Reset here</Link></span>
        </p>
        <hr className="my-5" />

        <div className="text-center">
          <span>I don&apos;t have an account?</span>
          <span className="underline text-blue-800">
            <Link href="/sign-up"> Sign up</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Page;
