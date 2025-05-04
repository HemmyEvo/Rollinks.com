'use client'

import { Button } from "@/components/ui/button";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [err, setErr] = useState({ password: '', confirmPassword: '' });
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [complete, setComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successfulCreation, setSuccessfulCreation] = useState(false)
    const [secondFactor, setSecondFactor] = useState(false);
    const { signIn, isLoaded, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter()

    React.useEffect(() => {
        if (isSignedIn) {
            window.location.href = '/';
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
        if (password !== confirmPassword) {
            newErr.confirmPassword = 'Passwords must be the same';
            hasErrors = true;
        }

        setErr(newErr);

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="backdrop-blur-lg bg-white/30 dark:bg-black/30 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                    <div className="p-8">
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center mb-8"
                        >
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
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {successfulCreation && !complete ? 
                                    (isCodeVerified ? 'Set New Password' : 'Verify Your Email') : 
                                    (!complete ? 'Reset Your Password' : 'Password Reset Complete')}
                            </p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={!successfulCreation ? requestResetCode : (isCodeVerified ? resetPassword : verifyCode)}>
                            {!successfulCreation && !complete && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setError(null) }}
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending Code...
                                            </>
                                        ) : 'Send Reset Code'}
                                    </Button>

                                    <div className="pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                        <span>Remember your password? </span>
                                        <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                            Sign In
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {successfulCreation && !isCodeVerified && !complete && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm"
                                    >
                                        Verification code has been sent to your email
                                    </motion.div>

                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Verification Code
                                        </label>
                                        <input
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            type="text"
                                            id="code"
                                            className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center tracking-widest font-mono"
                                            placeholder="123456"
                                            maxLength={6}
                                            required
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify Code'}
                                    </Button>
                                </motion.div>
                            )}

                            {isCodeVerified && !complete && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setErr(prev => ({...prev, password: ''})) }}
                                                id="password"
                                                className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                                                placeholder="••••••••"
                                                required
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

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => { setConfirmPassword(e.target.value); setErr(prev => ({...prev, confirmPassword: ''})) }}
                                                id="confirmPassword"
                                                className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {err.confirmPassword && <p className="mt-1 text-sm text-red-500">{err.confirmPassword}</p>}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                                    >
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </motion.div>
                            )}
                        </form>

                        {complete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                                    Your password has been successfully updated!
                                </div>
                                <Link 
                                    href="/" 
                                    className="inline-block w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                                >
                                    Continue to Homepage
                                </Link>
                            </motion.div>
                        )}

                        {secondFactor && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm"
                            >
                                Two-factor authentication is required. Please check your second authentication device.
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;