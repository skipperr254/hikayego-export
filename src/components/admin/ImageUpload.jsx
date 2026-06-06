import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { Upload, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import imageCompression from "browser-image-compression";
// import Compressor from "compressorjs";

const ImageUpload = ({ storyForm, setStoryForm }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir resim dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Resim dosyası 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `story-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Compress the image
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/jpeg",
      };
      const compressedFile = await imageCompression(file, options);

      // console.log("Original file size:", file.size / 1024, "KB");
      // const compressedFile = await imageCompression(file, options);
      // console.log("Compressed file size:", compressedFile.size / 1024, "KB");

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("story_images")
        .upload(fileName, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast({
          title: "Hata",
          description: `Resim yüklenirken bir hata oluştu: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("story_images").getPublicUrl(fileName);

      // Update form with image URL
      setStoryForm((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));

      toast({
        title: "Başarılı",
        description: "Resim başarıyla yüklendi.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Hata",
        description: `Resim yüklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (storyForm.image_url) {
      try {
        // Extract filename from URL
        const url = new URL(storyForm.image_url);
        const fileName = url.pathname.split("/").pop();

        // Delete from storage
        await supabase.storage.from("story_images").remove([fileName]);
      } catch (error) {
        console.error("Error removing image:", error);
      }
    }

    setStoryForm((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  return (
    <div>
      <Label htmlFor='story-image'>Hikaye Resmi</Label>
      <div className='space-y-2'>
        <AnimatePresence mode='wait'>
          {storyForm.image_url ? (
            <motion.div
              key='image-preview'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative'
            >
              <img
                src={storyForm.image_url}
                alt='Hikaye resmi'
                className='w-full h-32 object-cover rounded-md border'
              />
              <Button
                type='button'
                variant='destructive'
                size='sm'
                className='absolute top-2 right-2'
                onClick={handleRemoveImage}
              >
                <X className='h-3 w-3' />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key='upload-ui'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center'
            >
              <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
              <p className='text-sm text-muted-foreground mb-2'>
                Resim yüklemek için tıklayın
              </p>
              <Input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                disabled={uploading}
                className='cursor-pointer'
              />
            </motion.div>
          )}
        </AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center justify-center py-2'
          >
            <Loader2 className='h-4 w-4 animate-spin mr-2' />
            <span className='text-sm'>Yükleniyor...</span>
          </motion.div>
        )}
      </div>
      <p className='text-xs text-muted-foreground mt-1'>
        JPG, PNG, GIF formatları desteklenir. Maksimum 5MB.
      </p>
    </div>
  );
};

export default ImageUpload;