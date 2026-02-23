'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, otpSchema, type LoginFormValues, type OtpFormValues } from '@/lib/schemas';
import { Button, Card } from '@/components/form-elements';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, ArrowRight, ShieldCheck } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface AuthFlowProps {
  onSuccess: () => void;
}

export default function AuthFlow({ onSuccess }: AuthFlowProps) {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    console.log('Login attempt:', data);
    setEmail(data.email);
    setStep('otp');
  };

  const onOtpSubmit = (data: OtpFormValues) => {
    console.log('OTP verification:', data);
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4a907a]/10 to-white">
      <AnimatePresence mode="wait">
        {step === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 border-none shadow-2xl rounded-[32px]">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-[#4a907a] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#4a907a]/30">
                  <Fish className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Foodaily Farmer</h1>
                <p className="text-zinc-500 text-sm mt-1">Sign in to manage your harvests</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-700">Email Address</label>
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <InputText 
                        {...field}
                        placeholder="farmer@example.com"
                        className={cn("w-full rounded-xl h-12", loginForm.formState.errors.email && "p-invalid")}
                      />
                    )}
                  />
                  {loginForm.formState.errors.email && <small className="p-error">{loginForm.formState.errors.email.message}</small>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-700">Password</label>
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field }) => (
                      <InputText 
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className={cn("w-full rounded-xl h-12", loginForm.formState.errors.password && "p-invalid")}
                      />
                    )}
                  />
                  {loginForm.formState.errors.password && <small className="p-error">{loginForm.formState.errors.password.message}</small>}
                </div>
                <Button type="submit" className="w-full h-12 text-base group bg-[#4a907a] border-none rounded-xl text-white hover:bg-[#3d7a66]">
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 border-none shadow-2xl rounded-[32px]">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-[#4a907a]" />
                </div>
                <h1 className="text-2xl font-bold">Verify Identity</h1>
                <p className="text-zinc-500 text-sm mt-1 text-center">
                  We&apos;ve sent a 6-digit code to <br />
                  <span className="font-semibold text-zinc-900">{email}</span>
                </p>
              </div>

              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-700 text-center">One-Time Password</label>
                  <Controller
                    name="otp"
                    control={otpForm.control}
                    render={({ field }) => (
                      <InputText 
                        {...field}
                        placeholder="000000"
                        maxLength={6}
                        className={cn(
                          "w-full text-center text-2xl tracking-[0.5em] font-mono rounded-xl h-14",
                          otpForm.formState.errors.otp && "p-invalid"
                        )}
                      />
                    )}
                  />
                  {otpForm.formState.errors.otp && <small className="p-error text-center">{otpForm.formState.errors.otp.message}</small>}
                </div>
                <div className="space-y-3">
                  <Button type="submit" className="w-full h-12 text-base bg-[#4a907a] border-none rounded-xl text-white hover:bg-[#3d7a66]">
                    Verify & Login
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-xl"
                    onClick={() => setStep('login')}
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
