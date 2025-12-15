import React from 'react';
import { Button } from '@/components/ui/button';
import { PaneButtonConfig, ButtonVariant } from '@/types/dynamicForm';
import { ChevronLeft, ChevronRight, Save, Send, X, Trash2, CheckCircle } from 'lucide-react';

interface DynamicButtonRendererProps {
  buttons: PaneButtonConfig[];
  currentPaneIndex: number;
  totalPanes: number;
  isLastPaneOfStage?: boolean;
  isFinalStage?: boolean;
  onNavigate: (direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => void;
  onSave: (type: 'draft' | 'template') => void;
  onStageSubmit?: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
  onClose: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const getButtonIcon = (action: PaneButtonConfig['action'], isFinalStage?: boolean) => {
  switch (action) {
    case 'previous_pane':
      return <ChevronLeft className="w-4 h-4 mr-1" />;
    case 'next_pane':
      return <ChevronRight className="w-4 h-4 ml-1" />;
    case 'save_draft':
    case 'save_template':
      return <Save className="w-4 h-4 mr-1" />;
    case 'submit':
      return isFinalStage ? <CheckCircle className="w-4 h-4 mr-1" /> : <Send className="w-4 h-4 mr-1" />;
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
  onNavigate,
  onSave,
  onStageSubmit,
  onSubmit,
  onDiscard,
  onClose,
  isLoading = false,
  disabled = false,
}) => {
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

  // Transform buttons based on stage position
  const transformedButtons = buttons.map(btn => {
    // If this is the last pane of a stage and button is "next_pane", show "Submit" instead
    if (btn.action === 'next_pane' && isLastPaneOfStage) {
      return {
        ...btn,
        label: isFinalStage ? 'Approve & Complete' : 'Submit',
        action: 'submit' as const,
      };
    }
    return btn;
  });

  // Filter visible buttons and sort by order
  const visibleButtons = transformedButtons
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
            variant={button.action === 'submit' ? 'default' : mapVariant(button.variant)}
            onClick={() => handleButtonClick(button)}
            disabled={isButtonDisabled(button)}
            className={button.action === 'submit' && isFinalStage ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {button.action !== 'next_pane' && getButtonIcon(button.action, isFinalStage)}
            {button.label}
            {button.action === 'next_pane' && getButtonIcon(button.action)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DynamicButtonRenderer;