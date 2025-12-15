import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PaneButtonConfig, ButtonVariant } from '@/types/dynamicForm';
import { ChevronLeft, ChevronRight, Save, Send, X, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface DynamicButtonRendererProps {
  buttons: PaneButtonConfig[];
  currentPaneIndex: number;
  totalPanes: number;
  isLastPaneOfStage?: boolean;
  isFinalStage?: boolean;
  stageName?: string;
  onNavigate: (direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => void;
  onSave: (type: 'draft' | 'template') => void;
  onStageSubmit?: () => void;
  onSubmit: () => void;
  onReject?: (reason: string) => Promise<void>;
  onDiscard: () => void;
  onClose: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const getButtonIcon = (action: PaneButtonConfig['action'], isApprovalStage?: boolean) => {
  switch (action) {
    case 'previous_pane':
      return <ChevronLeft className="w-4 h-4 mr-1" />;
    case 'next_pane':
      return <ChevronRight className="w-4 h-4 ml-1" />;
    case 'save_draft':
    case 'save_template':
      return <Save className="w-4 h-4 mr-1" />;
    case 'submit':
      return isApprovalStage ? <CheckCircle className="w-4 h-4 mr-1" /> : <Send className="w-4 h-4 mr-1" />;
    case 'reject':
      return <XCircle className="w-4 h-4 mr-1" />;
    case 'discard':
      return <Trash2 className="w-4 h-4 mr-1" />;
    case 'close':
      return <X className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

const mapVariant = (variant: ButtonVariant): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
  switch (variant) {
    case 'destructive':
      return 'destructive';
    case 'outline':
      return 'outline';
    case 'secondary':
      return 'secondary';
    case 'ghost':
      return 'ghost';
    default:
      return 'default';
  }
};

const DynamicButtonRenderer: React.FC<DynamicButtonRendererProps> = ({
  buttons,
  currentPaneIndex,
  totalPanes,
  isLastPaneOfStage = false,
  isFinalStage = false,
  stageName = '',
  onNavigate,
  onSave,
  onStageSubmit,
  onSubmit,
  onReject,
  onDiscard,
  onClose,
  isLoading = false,
  disabled = false,
}) => {
  // Reject dialog state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Check if current stage is the Approval stage (case-insensitive)
  const isApprovalStage = stageName.toLowerCase().includes('approval');
  // Check if current stage is Data Entry stage (case-insensitive)
  const isDataEntryStage = stageName.toLowerCase().includes('data entry');
  
  const handleButtonClick = (button: PaneButtonConfig) => {
    switch (button.action) {
      case 'next_pane':
        // If this is the last pane of the stage, treat as stage submit
        if (isLastPaneOfStage && onStageSubmit) {
          onStageSubmit();
        } else {
          onNavigate('next');
        }
        break;
      case 'previous_pane':
        onNavigate('previous');
        break;
      case 'save_draft':
        onSave('draft');
        break;
      case 'save_template':
        onSave('template');
        break;
      case 'submit':
        if (onStageSubmit) {
          onStageSubmit();
        } else {
          onSubmit();
        }
        break;
      case 'reject':
        setIsRejectDialogOpen(true);
        break;
      case 'discard':
        onDiscard();
        break;
      case 'close':
        onClose();
        break;
      case 'custom':
        if (button.targetPaneId) {
          onNavigate('pane', button.targetPaneId);
        }
        break;
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return;
    
    setIsRejecting(true);
    try {
      if (onReject) {
        await onReject(rejectReason);
      }
      setIsRejectDialogOpen(false);
      setRejectReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  // Transform buttons based on stage position
  const transformedButtons = buttons.map(btn => {
    // If this is the last pane of a stage and button is "next_pane", show appropriate label
    if (btn.action === 'next_pane' && isLastPaneOfStage) {
      // Only show "Approve & Complete" for Approval stage, "Submit" for all others
      const label = isApprovalStage && isFinalStage ? 'Approve & Complete' : 'Submit';
      return {
        ...btn,
        label,
        action: 'submit' as const,
      };
    }
    return btn;
  });

  // Add "Save as Template" button for Data Entry stage only (before Save as Draft)
  let finalButtons = [...transformedButtons];
  if (isDataEntryStage) {
    const saveDraftIndex = finalButtons.findIndex(btn => btn.action === 'save_draft');
    const saveTemplateButton: PaneButtonConfig = {
      id: 'save_template_auto',
      label: 'Save as Template',
      action: 'save_template',
      variant: 'outline',
      position: 'right',
      order: saveDraftIndex >= 0 ? finalButtons[saveDraftIndex].order - 0.5 : 2,
      isVisible: true,
    };
    
    // Insert before Save as Draft if it exists, otherwise add to the list
    if (saveDraftIndex >= 0) {
      finalButtons.splice(saveDraftIndex, 0, saveTemplateButton);
    } else {
      finalButtons.push(saveTemplateButton);
    }
  }

  // Add "Reject" button for Approval stage only (before Approve & Complete)
  if (isApprovalStage && isLastPaneOfStage && onReject) {
    const submitIndex = finalButtons.findIndex(btn => btn.action === 'submit');
    const rejectButton: PaneButtonConfig = {
      id: 'reject_auto',
      label: 'Reject',
      action: 'reject',
      variant: 'destructive',
      position: 'right',
      order: submitIndex >= 0 ? finalButtons[submitIndex].order - 0.5 : 4,
      isVisible: true,
    };
    
    // Insert before Submit/Approve button if it exists
    if (submitIndex >= 0) {
      finalButtons.splice(submitIndex, 0, rejectButton);
    } else {
      finalButtons.push(rejectButton);
    }
  }

  // Filter visible buttons and sort by order
  const visibleButtons = finalButtons
    .filter(btn => btn.isVisible)
    .sort((a, b) => a.order - b.order);

  const leftButtons = visibleButtons.filter(btn => btn.position === 'left');
  const rightButtons = visibleButtons.filter(btn => btn.position === 'right');

  // Disable previous on first pane
  const isButtonDisabled = (button: PaneButtonConfig) => {
    if (disabled || isLoading) return true;
    if (button.action === 'previous_pane' && currentPaneIndex === 0) return true;
    return false;
  };

  return (
    <>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {/* Left-aligned buttons */}
        <div className="flex items-center gap-2">
          {leftButtons.map((button) => (
            <Button
              key={button.id}
              variant={mapVariant(button.variant)}
              onClick={() => handleButtonClick(button)}
              disabled={isButtonDisabled(button)}
            >
              {button.action === 'previous_pane' && getButtonIcon(button.action)}
              {button.label}
            </Button>
          ))}
        </div>

        {/* Right-aligned buttons */}
        <div className="flex items-center gap-2">
          {rightButtons.map((button) => (
            <Button
              key={button.id}
              variant={button.action === 'submit' ? 'default' : button.action === 'reject' ? 'destructive' : mapVariant(button.variant)}
              onClick={() => handleButtonClick(button)}
              disabled={isButtonDisabled(button)}
              className={button.action === 'submit' && isApprovalStage && isFinalStage ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {button.action !== 'next_pane' && getButtonIcon(button.action, isApprovalStage && isFinalStage)}
              {button.label}
              {button.action === 'next_pane' && getButtonIcon(button.action)}
            </Button>
          ))}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectReason('');
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicButtonRenderer;