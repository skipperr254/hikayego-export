import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Calendar, Clock, RefreshCw, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumFeatures from "./subscription/PremiumFeatures";

const SubscriptionManagement = () => {
  const { profile, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const { expiresAt, daysLeft, isExpiringSoon } = useMemo(() => {
    if (!profile?.premium_expires_at) return { expiresAt: null, daysLeft: null, isExpiringSoon: false };
    const exp = new Date(profile.premium_expires_at);
    const diffMs = exp.getTime() - Date.now();
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return {
      expiresAt: exp,
      daysLeft: days,
      isExpiringSoon: days <= 30,
    };
  }, [profile]);

  // No active premium at all — show upsell
  if (!["active", "trial", "cancelled"].includes(subscriptionStatus)) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Premium'a Geç
          </CardTitle>
          <CardDescription>
            Tüm özelliklerin kilidini açın ve öğrenme deneyiminizi geliştirin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PremiumFeatures />
            <Button className="w-full btn-glow" onClick={() => navigate("/subscription")}>
              <Crown className="mr-2 h-4 w-4" />
              Paket Satın Al
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // One-time package user: has premium_expires_at set
  if (expiresAt) {
    return (
      <Card className={`${isExpiringSoon ? "border-amber-300 dark:border-amber-700" : "border-amber-200 dark:border-amber-800"}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-amber-500" />
            Premium Üyeliğim
          </CardTitle>
          <CardDescription>
            {isExpiringSoon
              ? "Premium üyeliğin yakında sona eriyor."
              : "Aktif Premium üyeliğin devam ediyor."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Expiry info */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Premium bitiş tarihi</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {expiresAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Kalan süre</p>
                <p className={`font-semibold ${daysLeft <= 7 ? "text-red-600 dark:text-red-400" : daysLeft <= 30 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>
                  {daysLeft === 0 ? "Bugün sona eriyor" : `${daysLeft} gün`}
                </p>
              </div>
            </div>
          </div>

          {/* Renewal prompt */}
          {isExpiringSoon && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-center text-muted-foreground">
              Premium erişimini sürdürmek için yeni bir paket satın alabilirsin.
            </div>
          )}

          <Button
            className="w-full"
            variant={isExpiringSoon ? "default" : "outline"}
            onClick={() => navigate("/subscription")}
          >
            {isExpiringSoon ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeni Paket Al
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Paket Süresini Uzat
              </>
            )}
          </Button>

          {/* Payment logos */}
          <div
            className="flex justify-center items-center space-x-4 pt-2 border-t border-border/50"
            aria-label="Iyzico ile Güvenli Öde – Visa & MasterCard desteklenir"
          >
            <img
              src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/43bdb00cc0419a670bff93608bd18e93.png"
              alt="iyzico ile Öde"
              className="h-8 object-contain"
            />
            <div className="border-l h-6 border-border"></div>
            <img
              src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/68cc4940906159e97da1ee1d73e1ebd3.png"
              alt="MasterCard"
              className="h-8 object-contain"
            />
            <img
              src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/2fcd11116b5d21ed99e9d7165d71bcc6.webp"
              alt="Visa"
              className="h-8 object-contain"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Legacy subscription user (active subscription without premium_expires_at)
  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-amber-500" />
          Premium Üyeliğim
        </CardTitle>
        <CardDescription>
          Premium üyeliğin aktif.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.subscription_date && (
          <div className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Üyelik başlangıcı</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {new Date(profile.subscription_date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        )}

        <Button className="w-full" variant="outline" onClick={() => navigate("/subscription")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Paket Satın Al
        </Button>

        <div className="flex justify-center items-center space-x-4 pt-2 border-t border-border/50">
          <img
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/43bdb00cc0419a670bff93608bd18e93.png"
            alt="iyzico ile Öde"
            className="h-8 object-contain"
          />
          <div className="border-l h-6 border-border"></div>
          <img
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/68cc4940906159e97da1ee1d73e1ebd3.png"
            alt="MasterCard"
            className="h-8 object-contain"
          />
          <img
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/2fcd11116b5d21ed99e9d7165d71bcc6.webp"
            alt="Visa"
            className="h-8 object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
