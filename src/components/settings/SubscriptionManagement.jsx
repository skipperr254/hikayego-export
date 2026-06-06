import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, AlertTriangle, RefreshCw, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CancellationDialog from "./subscription/CancellationDialog";
import SubscriptionStatus from "./subscription/SubscriptionStatus";
import SubscriptionDetails from "./subscription/SubscriptionDetails";
import PremiumFeatures from "./subscription/PremiumFeatures";
import { supabase } from "@/lib/customSupabaseClient";

const SubscriptionManagement = () => {
  const { profile, refreshUserProfile, subscriptionStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cancellationStep, setCancellationStep] = useState(1);
  const [cancellationData, setCancellationData] = useState({
    reason: "",
    feedback: "",
    improvement: "",
  });

  const { nextPaymentDate, trialDaysLeft } = useMemo(() => {
    let paymentDate = null;
    let daysLeft = 0;

    if (profile?.trial_end_date) {
      const trialEndDate = new Date(profile.trial_end_date);
      paymentDate = trialEndDate;
      const diffTime = trialEndDate.getTime() - new Date().getTime();
      daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else if (profile?.next_payment_date) {
      paymentDate = new Date(profile.next_payment_date);
    }

    return {
      nextPaymentDate: paymentDate,
      trialDaysLeft: daysLeft,
    };
  }, [profile]);

  const getSimplifiedErrorMessage = (error) => {
    const message = error.message || "Bilinmeyen bir hata oluştu.";
    if (
      message.includes("signature does not match") ||
      message.toLowerCase().includes("imza hatası")
    ) {
      return "Ödeme başlatılamadı (imza hatası). Lütfen daha sonra tekrar deneyin.";
    }
    if (
      message.includes("11") ||
      message.toLowerCase().includes("geçersiz istek")
    ) {
      return "Geçersiz bir istek gönderildi. Lütfen girdiğiniz bilgileri kontrol edip tekrar deneyin.";
    }
    if (message.includes("Failed to fetch")) {
      return "Ödeme servisine ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.";
    }
    return `Bir hata oluştu: ${message}`;
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Kimlik doğrulama oturumu bulunamadı.");

      const response = await fetch(
        "https://vjxkmufoztgzrnwaxswo.supabase.co/functions/v1/iyzico-resubscribe",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Bilinmeyen bir hata oluştu.");
      }

      if (result.checkoutFormContent) {
        navigate("/subscription/iyzico-checkout", {
          state: { checkoutFormContent: result.checkoutFormContent },
        });
      } else if (result.paymentPageUrl) {
        window.location.href = result.paymentPageUrl;
      } else {
        throw new Error(
          "Iyzico'dan geçersiz yanıt alındı veya form içeriği boş."
        );
      }
    } catch (error) {
      console.error("Subscription reactivation failed:", error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu!",
        description: getSimplifiedErrorMessage(error),
      });
    } finally {
      setIsReactivating(false);
    }
  };

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "iyzico-cancel-payment",
        {
          body: {
            action: "cancel_subscription",
            payload: {
              reason: cancellationData.reason,
              feedback: {
                feedback: cancellationData.feedback,
                improvement: cancellationData.improvement,
              },
            },
          },
        }
      );
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      await refreshUserProfile();
      toast({
        title: "İptal Talebiniz Alındı",
        description: `Aboneliğiniz bir sonraki fatura döneminde sonlanacak. O zamana kadar tüm premium özellikler sizinle!`,
      });
      setIsCancelling(false);
    } catch (error) {
      console.error("Subscription cancellation failed:", error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu!",
        description: getSimplifiedErrorMessage(error),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCancellationDialog = () => {
    setCancellationStep(1);
    setCancellationData({ reason: "", feedback: "", improvement: "" });
    setIsCancelling(true);
  };

  const isPendingCancellation =
    subscriptionStatus === "cancelled" && profile?.cancellation_date;
  if (!["active", "trial", "cancelled"].includes(subscriptionStatus)) {
    return (
      <Card className='border-primary/20'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Crown className='h-5 w-5 mr-2 text-primary' />
            Premium'a Geç
          </CardTitle>
          <CardDescription>
            Tüm özelliklerin kilidini açın ve öğrenme deneyiminizi geliştirin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <PremiumFeatures />
            <Button
              className='w-full btn-glow'
              onClick={() => navigate("/subscription")}
            >
              <Crown className='mr-2 h-4 w-4' />
              Premium'a Geç - ₺149,99/ay
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='border-amber-200 dark:border-amber-800'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Crown className='h-5 w-5 mr-2 text-amber-500' />
            Premium Abonelik Yönetimi
          </CardTitle>
          <CardDescription>
            Mevcut aboneliğinizi detaylı olarak yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <SubscriptionStatus
              subscriptionStatus={subscriptionStatus}
              trialDaysLeft={trialDaysLeft}
              nextPaymentDate={nextPaymentDate}
              isPendingCancellation={isPendingCancellation}
            />

            <SubscriptionDetails
              profile={profile}
              nextPaymentDate={nextPaymentDate}
            />

            <div className='pt-4 border-t border-border/50'>
              {isPendingCancellation ? (
                <div className='space-y-3'>
                  <Button
                    onClick={handleReactivateSubscription}
                    className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/50'
                    disabled={isReactivating}
                  >
                    {isReactivating ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <RefreshCw className='mr-2 h-4 w-4' />
                    )}
                    {isReactivating
                      ? "Yeniden Aktif Ediliyor..."
                      : "Aboneliği Sürdür"}
                  </Button>
                  <p className='text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5'>
                    <Info className='h-3 w-3' /> Fikrinizi değiştirdiğiniz için
                    mutluyuz!
                  </p>
                </div>
              ) : (
                <Button
                  variant='outline'
                  className='w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                  onClick={handleOpenCancellationDialog}
                >
                  <AlertTriangle className='mr-2 h-4 w-4' />
                  Aboneliği İptal Et
                </Button>
              )}
            </div>

            <div
              className='flex justify-center items-center space-x-4 pt-4 border-t border-border/50'
              aria-label='Iyzico ile Güvenli Öde – Visa & MasterCard desteklenir'
            >
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/43bdb00cc0419a670bff93608bd18e93.png'
                alt='iyzico ile Öde'
                className='h-8 object-contain'
              />
              <div className='border-l h-6 border-border'></div>
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/68cc4940906159e97da1ee1d73e1ebd3.png'
                alt='MasterCard'
                className='h-8 object-contain'
              />
              <img
                src='https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/2fcd11116b5d21ed99e9d7165d71bcc6.webp'
                alt='Visa'
                className='h-8 object-contain'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CancellationDialog
        isOpen={isCancelling}
        onClose={() => setIsCancelling(false)}
        onConfirmCancellation={handleConfirmCancellation}
        cancellationStep={cancellationStep}
        setCancellationStep={setCancellationStep}
        cancellationData={cancellationData}
        setCancellationData={setCancellationData}
        subscriptionEndDate={nextPaymentDate?.toLocaleDateString("tr-TR")}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default SubscriptionManagement;