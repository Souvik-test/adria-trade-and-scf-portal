
import React from 'react';

interface FooterProps {
  loginTime: string;
}

const Footer: React.FC<FooterProps> = ({ loginTime }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-6">
          <span><strong>Corporate:</strong> TestCorp Ltd</span>
          <span><strong>Corporate ID:</strong> TC001</span>
          <span><strong>User ID:</strong> TCU001</span>
          <span><strong>Login Time:</strong> {loginTime}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
