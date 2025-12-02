import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Upload, Edit2, Check, X } from 'lucide-react';
import { customAuth } from '@/services/customAuth';

const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [corporateName, setCorporateName] = useState('Client aDria Ltd');
  const [corporateLogo, setCorporateLogo] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  const [businessCentre, setBusinessCentre] = useState('Adria TSCF Client');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    fullName: '',
    userLoginId: ''
  });

  useEffect(() => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try custom auth first
      const customResult = await customAuth.signIn(loginForm.email, loginForm.password);
      
      if (customResult.session) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back!'
        });
        navigate('/');
        return;
      }

      // Fall back to Supabase Auth
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login Successful',
          description: 'Welcome back!'
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(signupForm.email, signupForm.password, {
        full_name: signupForm.fullName,
        user_login_id: signupForm.userLoginId
      });
      
      if (error) {
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Signup Successful',
          description: 'Please check your email to confirm your account'
        });
      }
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 mb-4">
            {corporateLogo && (
              <img src={corporateLogo} alt="Corporate Logo" className="h-16 w-16 object-contain" />
            )}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-lg font-semibold">{corporateName}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleStartEdit}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button size="sm" variant="outline" asChild>
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </span>
              </Button>
            </label>
          </div>
          <CardTitle className="text-center">Adria Trade and SCF Studio</CardTitle>
          <CardDescription className="text-center">
            Adria Trade and SCF Studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-centre">Business Centre</Label>
                  <Select value={businessCentre} onValueChange={setBusinessCentre}>
                    <SelectTrigger id="business-centre" className="bg-background">
                      <SelectValue placeholder="Select Business Centre" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="Adria TSCF Client">Adria TSCF Client</SelectItem>
                      <SelectItem value="Adria Process Orchestrator">Adria Process Orchestrator</SelectItem>
                      <SelectItem value="Adria TSCF Bank">Adria TSCF Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-business-centre">Business Centre</Label>
                  <Select value={businessCentre} onValueChange={setBusinessCentre}>
                    <SelectTrigger id="signup-business-centre" className="bg-background">
                      <SelectValue placeholder="Select Business Centre" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="Adria TSCF Client">Adria TSCF Client</SelectItem>
                      <SelectItem value="Adria Process Orchestrator">Adria Process Orchestrator</SelectItem>
                      <SelectItem value="Adria TSCF Bank">Adria TSCF Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-login-id">User Login ID</Label>
                  <Input
                    id="user-login-id"
                    type="text"
                    value={signupForm.userLoginId}
                    onChange={(e) => setSignupForm({ ...signupForm, userLoginId: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;