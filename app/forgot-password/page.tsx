'use client'

import { Button } from "@/components/ui/button";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, SyntheticEvent } from "react";

const ForgotPassword: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [err, setErr] = useState({ password: '' ,   confirmPassword: ''});
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [complete, setComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successfulCreation, setSuccessfulCreation] = useState(false)
    const [secondFactor, setSecondFactor] = useState(false);
    const { signIn, isLoaded, setActive } = useSignIn();
    const { isSignedIn } = useAuth(); // Check if the user is signed in
    const router = useRouter()
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

    async function requestResetCode(e: SyntheticEvent) {
        e.preventDefault();
        setIsLoading(true)
        await signIn?.create({
            strategy: 'reset_password_email_code',
            identifier: email
        }).then(_ => {
            setError('')
            setSuccessfulCreation(true)
            setIsLoading(false)
        }).catch(error => {
            setError(error?.errors[0]?.longMessage)
            setIsLoading(false)
        });
    }

    async function verifyCode(e: SyntheticEvent) {
        e.preventDefault();
        setError('')
        setIsLoading(true);
        await signIn?.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code
        })
        .then(res => {
            if (res.status === 'needs_second_factor') {
                setSecondFactor(true);
            } else if (res.status === 'needs_new_password') {
                setIsCodeVerified(true);
                setIsLoading(false);
            }
        })
        .catch(error => {
            setError(error?.errors[0]?.longMessage);
            setIsLoading(false);
        });
    }

    async function resetPassword(e: SyntheticEvent) {
        e.preventDefault();
        const newErr: typeof err = {
            password: '',
            confirmPassword: '',
          };
      
          let hasErrors = false;
      
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
        setIsLoading(true);
        await signIn?.resetPassword({
            password
        })
        .then(res => {
            
            if (res.status === 'needs_second_factor') {
                setSecondFactor(true);
            } else if (res.status === 'complete') {
                setActive({ session: res.createdSessionId });
                setComplete(true);
                setIsLoading(false);
            }
        })
        .catch(error => {
            setError(error?.errors[0]?.longMessage);
            setIsLoading(false);
        });
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="max-w-sm w-lvw p-4 bg-[#e09d22dc] rounded-[10px] dark:bg-[#202020] shadow-md shadow-[#3b3b3b] mx-auto">
            <div className="logo mb-7 text-center">
       
       <h1 className="text-xl font-semibold flex items-center justify-center">
         <span> <Image src="/logo.jpg" alt="Hemmyevo" className='rounded-full drop-shadow-xl' width={50} height={50} /></span>
         
       </h1>
       <p className="tracking-widest font-[gerald] text-2xl text-white mt-2 ">Rollinks Skincare</p>
     </div>

                <h1 className="text-left font-semibold text-lg mb-3">
                    {successfulCreation && !complete ? (isCodeVerified ? 'New Password' : 'Verify Code') : (!complete ? 'Forgot Password' : '')}
                </h1>
                <form
                    onSubmit={!successfulCreation ? requestResetCode : (isCodeVerified ? resetPassword : verifyCode)}>
                    {!successfulCreation && !complete && (
                        <>
                            <div className="mb-5">
                            {error && (
                                    <p className='text-red-500 italic text-xs mb-2'>{error}</p>
                                )}
                                <input
                                    value={email}
                                    onChange={e => {setEmail(e.target.value); setIsLoading(false) }}
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
                                    placeholder='Email'
                                    required
                                />

                                
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                                </Button>
                            </div>
                            <hr className="my-5" />
                            <div className="text-center">
                                <span>I already have an account? </span>
                                <span className="underline text-blue-800">
                                    <Link href="/sign-in">Sign In</Link>
                                </span>
                            </div>
                        </>
                    )}

                    {successfulCreation && !isCodeVerified && !complete && (
                        <>  
                            <p className="text-green-700 mb-2">Verification code has been sent to your email</p>
                            <div className="mb-5 relative">
                                <input
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                                    placeholder='Enter Code'
                                    required
                                />
                            </div>
                            {error && (
                                <p className='text-red-500 italic text-sm mb-5'>{error}</p>
                            )}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>
                        </>
                    )}

                    {isCodeVerified && !complete && (
                        <>
                        {error && (
                                <p className='text-red-500 italic text-xs mb-5'>{error}</p>
                            )}
                            <div className="mb-5 relative">
                                
                            
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErr((prev) => ({ ...prev, password: '' })); }}
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                {err.password && <p className="text-red-600 text-sm mt-2">{err.password}</p>}
                            </div>
                            <div className="mb-5 relative">
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
                            {err.confirmPassword && <p className="text-red-600 text-sm mt-2">{err.confirmPassword}</p>}
                             </div>

                           
                   <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Verifying...' : 'Change Password'}
                        </Button>
                  
                   </>
                    )}

                   
                    
                    

                </form>
                {complete && (
                        <>
                        <p className="text-green-800">You have successfully changed your password</p>
                        <p>Go to <span className="underline  text-blue-800"><Link href="/">homepage...</Link></span></p>
                        </>
                        )
                    
                    }
                    {secondFactor && '2FA is required, this UI does not handle that'}

    
            </div>
        </div>
    );
};

export default ForgotPassword;
