import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#86efac] text-black hover:bg-[#4ade80]',
      secondary: 'bg-zinc-900 text-white hover:bg-zinc-800',
      outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50',
      ghost: 'hover:bg-zinc-100',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl bg-white p-6 shadow-sm border border-zinc-100", className)}>
    {children}
  </div>
);

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; options: { label: string; value: string }[] }>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              "w-5 h-5 rounded-md border-zinc-300 text-[#22c55e] focus:ring-[#86efac] transition-all",
              className
            )}
            {...props}
          />
          {label && <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{label}</span>}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export const Radio = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            ref={ref}
            className={cn(
              "w-5 h-5 border-zinc-300 text-[#22c55e] focus:ring-[#86efac] transition-all",
              className
            )}
            {...props}
          />
          {label && <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{label}</span>}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Radio.displayName = "Radio";

import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl"
        >
          <Card className="p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            {children}
          </Card>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium border-r border-zinc-200 pr-2">+233</span>
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-zinc-200 bg-white pl-14 pr-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
