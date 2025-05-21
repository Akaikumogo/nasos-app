import { motion, AnimatePresence } from 'framer-motion';

interface ErrorTextProps {
  error: boolean | undefined;
  message: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ error, message }) => {
  return (
    <div className="  bottom-[-15px]  h-[10px]">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-red-500"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorText;
