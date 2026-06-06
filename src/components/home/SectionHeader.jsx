import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, titleHighlight }) => {
  const renderTitle = () => {
    if (!titleHighlight) {
      return title;
    }
    const parts = title.split(titleHighlight);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {titleHighlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="relative text-center mb-16 max-w-3xl mx-auto">
      <div className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-8 sm:-inset-y-8 bg-gradient-to-br from-white/50 to-slate-100/50 dark:from-slate-800/20 dark:to-slate-900/20 backdrop-blur-lg rounded-3xl sm:rounded-[3rem] border border-white/30 dark:border-slate-700/30 shadow-lg shadow-black/5 -z-10"></div>
      <div className="p-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white tracking-tighter"
        >
          {renderTitle()}
        </motion.h2>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;