import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, Calendar, User, ArrowRight } from 'lucide-react';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionRef: string;
  status: string;
  rejectionReason?: string;
  rejectedFromStage?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  targetStage?: string;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  transactionRef,
  status,
  rejectionReason,
  rejectedFromStage,
  rejectedAt,
  rejectedBy,
  targetStage,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            Rejection Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Transaction Reference */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Transaction:</span>
            <span className="font-mono text-primary">{transactionRef}</span>
          </div>
          
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Badge variant="destructive">{status}</Badge>
          </div>
          
          {/* Stage Flow */}
          {rejectedFromStage && targetStage && (
            <div className="flex items-center justify-between bg-muted rounded-lg p-3">
              <div className="text-center">
                <span className="text-xs text-muted-foreground">Rejected From</span>
                <p className="font-medium text-destructive">{rejectedFromStage}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div className="text-center">
                <span className="text-xs text-muted-foreground">Returned To</span>
                <p className="font-medium text-primary">{targetStage}</p>
              </div>
            </div>
          )}
          
          {/* Rejection Timestamp */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Rejected At:
            </span>
            <span>{formatDate(rejectedAt)}</span>
          </div>
          
          {/* Rejected By (if available) */}
          {rejectedBy && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" />
                Rejected By:
              </span>
              <span>{rejectedBy}</span>
            </div>
          )}
          
          {/* Rejection Reason */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Reason for Rejection:</span>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-foreground">
                {rejectionReason || 'No reason provided'}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionReasonModal;
