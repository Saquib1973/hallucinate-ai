"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

type ButtonProps = HTMLMotionProps<"button"> & {
    variant?: "primary" | "outline" | "ghost";
    fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", fullWidth, children, ...props }, ref) => {
        const baseStyles = "cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-zinc-900 text-white hover:bg-black px-4 py-3.5 text-[15px] tracking-wide",
            outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200 px-4 py-2.5 text-[14px]",
            ghost: "bg-transparent text-gray-700 hover:bg-gray-100 px-4 py-2.5 text-[14px]",
        };

        const widthStyle = fullWidth ? "w-full" : "";

        return (
            <motion.button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";