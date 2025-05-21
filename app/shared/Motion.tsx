import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition: React.FC<{
  children: React.ReactNode;
  key?: string;
}> = ({ children, key }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key ? key : location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
