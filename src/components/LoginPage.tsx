
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [corporateId, setCorporateId] = useState('TC001');
  const [userId, setUserId] = useState('TCU001');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    if (corporateId && userId && password) {
      console.log('Login attempt:', { corporateId, userId, password });
      onLogin();
    }
  };

  const handleClear = () => {
    setCorporateId('TC001');
    setUserId('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-blue/10 to-corporate-blue/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 w-24 h-24 bg-corporate-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">TC</span>
          </div>
          <h1 className="text-3xl font-bold text-corporate-blue mb-2">TestCorp Ltd</h1>
          <p className="text-gray-600">Trade & Supply Chain Finance Portal</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Corporate ID</label>
            <Select value={corporateId} onValueChange={setCorporateId}>
              <SelectTrigger className="border-corporate-blue/30 focus:ring-corporate-blue">
                <SelectValue placeholder="Select Corporate ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TC001">TC001 - TestCorp Ltd</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">User Login ID</label>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="border-corporate-blue/30 focus:ring-corporate-blue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="border-corporate-blue/30 focus:ring-corporate-blue"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleLogin}
              className="flex-1 bg-corporate-blue hover:bg-corporate-blue/90"
            >
              Login
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="flex-1 border-corporate-blue text-corporate-blue hover:bg-corporate-blue/10"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
