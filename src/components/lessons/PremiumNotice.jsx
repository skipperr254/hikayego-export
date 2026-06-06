import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PremiumNotice = () => (
  <Card className="border-primary/20 bg-secondary/30 h-full flex flex-col items-center justify-center text-center">
    <CardHeader>
      <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="text-2xl">Bu İçerik Premium Üyelere Özel</CardTitle>
      <CardDescription>
        Tüm derslere ve özel içeriklere sınırsız erişim için aboneliğinizi yükseltin.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild className="cta-glow-button">
        <Link to="/subscription">
          <Crown className="mr-2 h-4 w-4" />
          Premium'a Geç
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default PremiumNotice;