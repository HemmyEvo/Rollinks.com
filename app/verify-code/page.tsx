'use client'
import React, { useEffect, useState } from 'react';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter} from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const Page = () => {
  const [code, setCode] = useState('');
  const [isloading, setIsLoading] = useState(false)
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null);
  const { signUp } = useSignUp();
  const [email, setEmail] = useState<string | null>(null);
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  // Redirect if authenticated
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/'); // Redirect to home page if user is signed in
    }
  }, [isSignedIn, router]);

  useEffect(() =>{
    const storedEmail = sessionStorage.getItem('emailForVerification');
    if(storedEmail){
      setEmail(storedEmail)
    }
    else{
      router.push('/sign-up')
    }
  },[router])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)


    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
       code 
      });
      if(signUpAttempt){
       // Show success toast
       toast.success('Login successful! Redirecting...');
     
       setTimeout(() => {
        window.location.pathname = '/'
       }, 2000);
      }
      else{
       setErr('Unable to connect to internet.')
      }
    
    }catch (error: any) {
      if (error?.errors) {
          error?.errors.forEach((err: any) => {
              toast.error(err.message || 'An unknown error occurred');
              
          });
      } else {
          toast.error('An error occurred during sign-up. Please try again.');
      }
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="h-[100vh] flex w-full items-center">
      <form onSubmit={handleSubmit} className="max-w-sm w-lvw p-4 bg-[#e09d22dc] rounded-[10px] dark:bg-[#202020] shadow-md shadow-[#3b3b3b] mx-auto">
      <div className="logo mb-7 text-center">
       
       <h1 className="text-xl font-semibold flex items-center justify-center">
         <span> <Image src="/logo.jpg" alt="Hemmyevo" className='rounded-full drop-shadow-xl' width={50} height={50} /></span>
         
       </h1>
       <p className="tracking-widest font-[gerald] text-2xl drop-shadow-2xl text-white mt-2 ">Rollinks Skincare</p>
     </div>
        <h1 className='text-left mb-2'>Verify Code</h1>
        <p className='text-left mb-7'>
            A verification code has been sent to your email <strong>{email}</strong>
        </p>
        {err && (
          <p className='text-red-500 text-center mb-4'>{err}</p>
        )}
                
        <div className="mb-5">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value) }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            placeholder='Verification Code'
          />
        </div>
      


        <Button type="submit" disabled={isloading}>
         {isloading ? "Verifying..." : "Verify"}
        </Button>
     
      </form>
    </div>
  );
};

export default Page;
