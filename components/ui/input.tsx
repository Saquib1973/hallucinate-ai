"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

export interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <motion.input
                    ref={ref}
                    className={`w-full rounded-full border border-gray-100 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 transition-all duration-500 focus:border-gray-300 focus:outline-none ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[13px] text-red-500 px-1"
                    >
                        {error}
                    </motion.span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
