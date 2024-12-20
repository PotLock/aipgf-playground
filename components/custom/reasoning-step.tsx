"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
interface ReasoningStepProps { step: any; children?: ReactNode; }
export const ReasoningStep = ({ step, children }: ReasoningStepProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 p-4 rounded-lg flex flex-col w-full justify-between"
        >
            <p className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">
                step
            </p>
            <h3 className="font-bold">{step.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{step.content}</p>
            {children}
        </motion.div>
    );
};