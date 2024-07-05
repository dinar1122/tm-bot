import React from 'react';

export const DefaultButton = ({ onClick, children, isIcon = false }:any) => {
  return (
    <button 
      type="button" 
      className={`${isIcon ? `px-3 py-1.5`:`px-5 py-2.5`} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

