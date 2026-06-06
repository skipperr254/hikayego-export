import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";

const IyzicoCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { checkoutFormContent } = location.state || {};

  useEffect(() => {
    if (!checkoutFormContent) {
      navigate("/subscription", { replace: true });
      return;
    }

    const container = formContainerRef.current;
    if (container) {
      container.innerHTML = checkoutFormContent;

      const scripts = Array.from(container.getElementsByTagName("script"));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      // 🔍 Watch for iframe insertion
      const observer = new MutationObserver(() => {
        const formContainer =
          container.querySelector(".notranslate") ||
          container.querySelector("#checkoutform-box");
        if (formContainer) {
          setIsLoading(false); // hide spinner
          observer.disconnect();
        }
      });

      observer.observe(container, { childList: true, subtree: true });
    }
  }, [checkoutFormContent, navigate]);

  if (!checkoutFormContent) return null;

  return (
    <>
      <Seo
        title='Ödeme Yapılıyor'
        description='Güvenli ödeme sayfasına yönlendiriliyorsunuz.'
        noindex={true}
      />
      <div className='flex flex-col items-center justify-center min-h-screen bg-white text-center p-4'>
        {isLoading && (
          <div className='flex flex-col items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
            <h1 className='text-2xl font-bold text-muted-foreground'>
              Yükleniyor...
            </h1>
          </div>
        )}

        {/* Checkout container */}
        <div
          ref={formContainerRef}
          id='iyzipay-checkout-form'
          className='responsive w-full max-w-lg mx-auto mt-6'
        />
      </div>
    </>
  );
};

export default IyzicoCheckoutPage;