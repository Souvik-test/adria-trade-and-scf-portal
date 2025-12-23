import React from 'react';
import { customAuth } from '@/services/customAuth';

interface FooterProps {
  loginTime: string;
}

const Footer: React.FC<FooterProps> = ({ loginTime }) => {
  const session = customAuth.getSession();
  const userName = session?.user?.full_name || 'Guest';
  const corporateId = session?.user?.corporate_id || 'TC001';
  
  // Get logged in business application from localStorage
  const businessCentre = localStorage.getItem('businessCentre') || '';
  const isAdriaClient = businessCentre === 'Adria TSCF Client';
  
  // Get client_id from session user
  const clientId = session?.user?.client_id || '';

  return (
    <div className="bg-muted/30 border-t border-border px-6 py-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          {isAdriaClient && clientId ? (
            <span><strong>Client ID:</strong> {clientId}</span>
          ) : (
            <span><strong>Corporate ID:</strong> {corporateId}</span>
          )}
          <span><strong>User Name:</strong> {userName}</span>
          <span><strong>Login Time:</strong> {loginTime}</span>
          {businessCentre && (
            <span><strong>Current Business Application:</strong> {businessCentre}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
