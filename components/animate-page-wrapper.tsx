"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatePageWrapperProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
}

const ANIMATION_DURATION = 0.6;

const AnimatePageWrapper = ({ children, className, duration = ANIMATION_DURATION }: AnimatePageWrapperProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration, ease: "easeIn" }}
            className={cn("w-full h-full", className)}
        >
            {children}
        </motion.div>
    );
};

export default AnimatePageWrapper;