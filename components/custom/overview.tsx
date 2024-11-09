import { motion } from 'framer-motion';
import { BotIcon } from 'lucide-react';
import Link from 'next/link';

import { MessageIcon } from './icons';


export const Overview = ({ intro }: { intro: string }) => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <BotIcon size={32} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          {intro}
        </p>
      </div>
    </motion.div>
  );
};
