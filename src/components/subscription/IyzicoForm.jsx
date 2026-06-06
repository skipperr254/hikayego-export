import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useNavigate } from "react-router-dom";

const IyzicoForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    identityNumber: "",
    gsmNumber: "",
    address: "",
    city: "",
    country: "Turkey",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = (user.name || "").split(" ");
      const lastName = lastNameParts.join(" ");

      setFormData((prev) => ({
        ...prev,
        name: firstName || "",
        surname: lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const fieldLabels = {
    name: "Ad",
    surname: "Soyad",
    email: "E-posta",
    identityNumber: "TC Kimlik Numarası",
    gsmNumber: "Telefon Numarası",
    address: "Adres",
    city: "Şehir",
    country: "Ülke",
  };

  const validateField = (id, value) => {
    let error = null;
    switch (id) {
      case "identityNumber":
        if (!/^[1-9][0-9]{10}$/.test(value)) {
          error = "TC Kimlik Numarası 11 haneli olmalıdır.";
        }
        break;
      case "gsmNumber":
        if (!/^\+90[0-9]{10}$/.test(value)) {
          error = "Telefon numarası +90 ile başlamalıdır. Örn: +905xxxxxxxxx";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Geçerli bir e-posta adresi giriniz.";
        }
        break;
      default:
        if (!value || value.trim() === "") {
          error = `${fieldLabels[id]} alanı zorunludur.`;
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [id]: error }));
    return !error;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      validateField(id, value);
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    validateField(id, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    for (const key in formData) {
      if (key === "zipCode") continue; // zipCode is optional
      if (!validateField(key, formData[key])) {
        isValid = false;
        if (!errors[key]) {
          newErrors[key] = `${fieldLabels[key]} alanı zorunludur.`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
    return isValid;
  };

  const getSimplifiedErrorMessage = (error) => {
    const message = error.message || "";
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
    return `Abonelik başlatılamadı. Hata: ${message}`;
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Formda eksik veya hatalı alanlar var!",
        description: "Lütfen tüm zorunlu alanları doldurup tekrar deneyin.",
      });
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication session not found.");

      const response = await fetch(
        "https://vjxkmufoztgzrnwaxswo.supabase.co/functions/v1/iyzico-initialize-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(formData),
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
      console.error("Subscription initialization failed:", error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu!",
        description: getSimplifiedErrorMessage(error),
      });
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubscribe}
        noValidate
        className='space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4'
      >
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <Label htmlFor='name'>Ad</Label>
            <Input
              id='name'
              value={formData.name}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder='Adınız'
              required
            />
            {errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
            )}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='surname'>Soyad</Label>
            <Input
              id='surname'
              value={formData.surname}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder='Soyadınız'
              required
            />
            {errors.surname && (
              <p className='text-red-500 text-xs mt-1'>{errors.surname}</p>
            )}
          </div>
        </div>
        <div className='space-y-1'>
          <Label htmlFor='email'>E-posta</Label>
          <Input
            id='email'
            type='email'
            value={formData.email}
            onBlur={handleBlur}
            onChange={handleInputChange}
            placeholder='E-posta adresiniz'
            required
          />
          {errors.email && (
            <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='identityNumber'>TC Kimlik Numarası</Label>
          <Input
            id='identityNumber'
            value={formData.identityNumber}
            onBlur={handleBlur}
            onChange={handleInputChange}
            placeholder='11 haneli TC kimlik no'
            required
            maxLength='11'
          />
          {errors.identityNumber && (
            <p className='text-red-500 text-xs mt-1'>{errors.identityNumber}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='gsmNumber'>Telefon Numarası</Label>
          <Input
            id='gsmNumber'
            type='tel'
            value={formData.gsmNumber}
            onBlur={handleBlur}
            onChange={handleInputChange}
            placeholder='+905xxxxxxxxx'
            required
          />
          {errors.gsmNumber && (
            <p className='text-red-500 text-xs mt-1'>{errors.gsmNumber}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='address'>Adres</Label>
          <Input
            id='address'
            value={formData.address}
            onBlur={handleBlur}
            onChange={handleInputChange}
            placeholder='Açık adresiniz'
            required
          />
          {errors.address && (
            <p className='text-red-500 text-xs mt-1'>{errors.address}</p>
          )}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <Label htmlFor='city'>Şehir</Label>
            <Input
              id='city'
              value={formData.city}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder='Şehir'
              required
            />
            {errors.city && (
              <p className='text-red-500 text-xs mt-1'>{errors.city}</p>
            )}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='zipCode'>Posta Kodu</Label>
            <Input
              id='zipCode'
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder='Posta kodu (isteğe bağlı)'
            />
          </div>
        </div>
        <div className='space-y-1'>
          <Label htmlFor='country'>Ülke</Label>
          <Input
            id='country'
            value={formData.country}
            onChange={handleInputChange}
            required
            disabled
            className='bg-muted/50'
          />
          {errors.country && (
            <p className='text-red-500 text-xs mt-1'>{errors.country}</p>
          )}
        </div>

        <div className='pt-4'>
          <Button
            type='submit'
            disabled={loading}
            className='w-full text-lg cta-glow-button py-6'
            size='lg'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <Loader2 className='h-5 w-5 animate-spin mr-2' />
                <span>Yönlendiriliyor...</span>
              </div>
            ) : (
              "Ödemeye Devam Et"
            )}
          </Button>
        </div>
        <p className='text-xs text-muted-foreground text-center pt-2'>
          Devam ettiğinizde Iyzico'nun güvenli ödeme sayfasına
          yönlendirileceksiniz.
        </p>
      </form>
      <div id='iyzico-form-container' className='hidden'></div>
    </>
  );
};

export default IyzicoForm;