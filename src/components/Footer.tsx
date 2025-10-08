
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FooterProps {
  loginTime: string;
}

const Footer: React.FC<FooterProps> = ({ loginTime }) => {
  const [corporateName, setCorporateName] = useState('Client aDria Ltd');
  const [corporateLogo, setCorporateLogo] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved values from localStorage
    const savedName = localStorage.getItem('corporateName');
    const savedLogo = localStorage.getItem('corporateLogo');
    if (savedName) setCorporateName(savedName);
    if (savedLogo) setCorporateLogo(savedLogo);
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Logo must be less than 2MB',
          variant: 'destructive'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCorporateLogo(result);
        localStorage.setItem('corporateLogo', result);
        toast({
          title: 'Logo uploaded',
          description: 'Corporate logo has been updated'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setTempName(corporateName);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (tempName.trim()) {
      setCorporateName(tempName.trim());
      localStorage.setItem('corporateName', tempName.trim());
      setIsEditing(false);
      toast({
        title: 'Updated',
        description: 'Corporate name has been updated'
      });
    }
  };

  const handleCancelEdit = () => {
    setTempName('');
    setIsEditing(false);
  };

  return (
    <div className="bg-muted/30 border-t border-border px-6 py-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {corporateLogo && (
              <img src={corporateLogo} alt="Corporate Logo" className="h-6 w-6 object-contain" />
            )}
            <span className="flex items-center gap-2">
              <strong>Corporate:</strong>
              {isEditing ? (
                <>
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-6 w-48 text-xs"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  {corporateName}
                  <Button size="icon" variant="ghost" className="h-5 w-5 ml-1" onClick={handleStartEdit}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </span>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button size="icon" variant="ghost" className="h-5 w-5" asChild>
                <span>
                  <Upload className="h-3 w-3" />
                </span>
              </Button>
            </label>
          </div>
          <span><strong>Corporate ID:</strong> TC001</span>
          <span><strong>User ID:</strong> TCU001</span>
          <span><strong>Login Time:</strong> {loginTime}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
