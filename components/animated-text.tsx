"use client";

import { AnimatePresence, motion } from "framer-motion";

export const AnimatedText = ({ text }: { text: string }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {text}
        </motion.div>
    </AnimatePresence>
);
