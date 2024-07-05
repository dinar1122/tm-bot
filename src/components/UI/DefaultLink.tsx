import React from 'react';

interface DefaultLinkProps {
  to: string;
  children: React.ReactNode;
}

const DefaultLink: React.FC<DefaultLinkProps> = ({ to, children }) => {
  return (
    <a href={to} className="font-medium text-blue-600 dark:text-blue-500 hover:underline h-min">
      {children}
    </a>
  );
};

export default DefaultLink;
