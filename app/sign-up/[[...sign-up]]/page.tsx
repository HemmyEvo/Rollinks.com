'use client'
import React, { useState } from 'react';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [err, setErr] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp,isLoaded } = useSignUp();
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const router = useRouter()

  // Redirect if authenticated
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/chat'); // Redirect to home page if user is signed in
    }
  }, [isSignedIn, router]);

  if(!isLoaded){
   
    return null
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErr: typeof err = {
      firstName: '',
      secondName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let hasErrors = false;

    // Validate each field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErr.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    if (firstName.trim().length < 3) {
      newErr.firstName = 'Please input a valid name';
      hasErrors = true;
    }
    if (secondName.trim().length < 3) {
      newErr.secondName = 'Please input a valid name';
      hasErrors = true;
    }
 
    if (password.trim().length < 8) {
      newErr.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }
    if (confirmPassword.trim().length < 8) {
      newErr.confirmPassword = 'Confirm password must be at least 8 characters long';
      hasErrors = true;
    }
    // Validate password confirmation
    if (password !== confirmPassword) {
      newErr.confirmPassword = 'Passwords must be the same';
      hasErrors = true;
    }

    // Update error state
    setErr(newErr);

    // If there are validation errors, return early
    if (hasErrors) {
      return;
    }
    
    setIsLoading(true) 
 
      try {
        const signUpAttempt = await signUp?.create({
          emailAddress: email,
          password: password,
          firstName: firstName,
          lastName: secondName,
  
        });
        sessionStorage.setItem('emailForVerification', email)
        const prepareVerify = await signUpAttempt?.prepareEmailAddressVerification()
      if(prepareVerify){
        router.push('/verify-code')
      }
      else{
        toast.error('Unable to connect to internet.')
      }
      } catch (error: any) {
      if (error?.errors) {
        error?.errors.forEach((err: any) => {
         setError(err.message || 'An unknown error occurred')
        });
      } else {
        toast.error('An error occurred during sign-up. Please try again.');
      }
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-[100vh] flex w-full py-5 items-center">
      <form onSubmit={handleSubmit} className="max-w-sm w-lvw p-4 bg-[#e09d22dc] rounded-[10px] dark:bg-[#202020] shadow-md shadow-[#3b3b3b] mx-auto">
      <div className="logo mb-7 text-center">
       
       <h1 className="text-xl font-semibold flex items-center justify-center">
         <span> <Image src="/logo.jpg" alt="Hemmyevo" className='rounded-full' width={50} height={50} /></span>   
       </h1>
       <p className="tracking-widest font-[gerald] text-2xl drop-shadow-2xl text-white mt-2 ">Rollinks Skincare</p>
     </div>
        {error && (
          <p className='text-red-500 text-center mb-4'>{error}</p>
        )}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => { err.firstName = ''; setFirstName(e.target.value) }}
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              type="text"
              placeholder="Jane" />
            <p className="text-red-500 text-xs italic">{err.firstName}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
              Last Name
            </label>
            <input
              value={secondName}
              onChange={(e) => { err.secondName = ''; setSecondName(e.target.value) }}
              id="secondName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              type="text"
              placeholder="Doe" />
            <p className="text-red-500 text-xs italic">{err.secondName}</p>
          </div>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={email}
            onChange={(e) => { err.email = ''; setEmail(e.target.value) }}
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            placeholder='Email'
          />
          <p className='text-red-500 text-xs italic'>{err.email}</p>
        </div>
      

        <div className="mb-5 relative">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { err.password = ''; setPassword(e.target.value) }}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              placeholder='Password'
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
            </button>
          </div>
          <p className='text-red-500 text-xs italic'>{err.password}</p>
        </div>

        <div className="mb-5 relative">
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { err.confirmPassword = ''; setConfirmPassword(e.target.value) }}
              id="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              placeholder='Confirm Password'
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
            </button>
          </div>
          <p className='text-red-500 text-xs italic'>{err.confirmPassword}</p>
        </div>

        <Button type="submit" disabled={isloading}>
         {isloading ? "Signing Up..." : "Sign Up"}
        </Button>
        <hr className='my-5' />
        <div className="text-center">
          <span>I already have an account? </span>
          <span className='underline text-blue-800'><Link href='/sign-in'>Sign in</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Page;
