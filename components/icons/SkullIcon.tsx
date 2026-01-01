
import React from 'react';

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM12 12c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 16.121a2 2 0 01-2.828 0L9.879 14.707a2 2 0 010-2.828l1.414-1.414a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828l-1.414 1.414z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1116 0h-2a6 6 0 10-12 0H4z" />
  </svg>
);
