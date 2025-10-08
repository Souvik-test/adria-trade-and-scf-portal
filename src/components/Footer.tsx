
import React from 'react';

interface FooterProps {
  loginTime: string;
}

const Footer: React.FC<FooterProps> = ({ loginTime }) => {
  return (
    <div className="bg-muted/30 border-t border-border px-6 py-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          <span><strong>Corporate ID:</strong> TC001</span>
          <span><strong>User ID:</strong> TCU001</span>
          <span><strong>Login Time:</strong> {loginTime}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
