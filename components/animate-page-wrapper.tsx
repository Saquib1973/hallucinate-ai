"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatePageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const AnimatePageWrapper = ({ children, className }: AnimatePageWrapperProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("w-full h-full", className)}
        >
            {children}
        </motion.div>
    );
};

export default AnimatePageWrapper;