
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type UserRoleType = 'Maker' | 'Checker' | 'Viewer' | 'All';
type ProductType = 'Import LC' | 'Export LC' | 'Import Bills' | 'Export Bills' | 'Outward BG/SBLC' | 'Inward BG/SBLC' | 'Shipping Guarantee' | 'Import Loan' | 'Export Loan';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userLoginId, setUserLoginId] = useState('');
  const [roleType, setRoleType] = useState<UserRoleType>('Viewer');
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const products: ProductType[] = [
    'Import LC', 'Export LC', 'Import Bills', 'Export Bills',
    'Outward BG/SBLC', 'Inward BG/SBLC', 'Shipping Guarantee',
    'Import Loan', 'Export Loan'
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleProductChange = (product: ProductType, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter(p => p !== product));
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            corporate_id: 'TC001',
            user_login_id: userLoginId,
            role_type: roleType,
            product_linkage: selectedProducts
          }
        }
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Sign up successful!',
          description: 'Please check your email to confirm your account.',
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Welcome back to TextCorp Ltd' : 'Join TextCorp Ltd'}
          </CardDescription>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Corporate ID: TC001 - TextCorp Ltd
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userLoginId">User Login ID</Label>
                <Input
                  id="userLoginId"
                  value={userLoginId}
                  onChange={(e) => setUserLoginId(e.target.value)}
                  placeholder="e.g., TCU001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleType">Role Type</Label>
                <Select value={roleType} onValueChange={(value: UserRoleType) => setRoleType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maker">Maker</SelectItem>
                    <SelectItem value="Checker">Checker</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product Linkage</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product} className="flex items-center space-x-2">
                      <Checkbox
                        id={product}
                        checked={selectedProducts.includes(product)}
                        onCheckedChange={(checked) => handleProductChange(product, checked as boolean)}
                      />
                      <Label htmlFor={product} className="text-sm">
                        {product}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            onClick={isLogin ? handleSignIn : handleSignUp}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
