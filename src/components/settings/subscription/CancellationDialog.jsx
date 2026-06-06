import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	HeartCrack,
	TrendingDown,
	Book,
	Zap,
	CalendarOff,
	Loader2,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CancellationDialog = ({
	isOpen,
	onClose,
	onConfirmCancellation,
	cancellationStep,
	setCancellationStep,
	cancellationData,
	setCancellationData,
	subscriptionEndDate,
	isProcessing,
}) => {
	const cancellationReasons = [
		{ value: "price", label: "Fiyatı çok yüksek buluyorum" },
		{ value: "usage", label: "Yeterince sık kullanmıyorum" },
		{ value: "features", label: "İhtiyacım olan özellikleri bulamadım" },
		{ value: "technical", label: "Teknik sorunlar yaşıyorum" },
		{ value: "alternative", label: "Başka bir hizmete geçiyorum" },
		{ value: "temporary", label: "Geçici olarak durdurmak istiyorum" },
		{ value: "other", label: "Diğer" },
	];

	const getStepProgress = () => {
		return (cancellationStep / 4) * 100;
	};

	const handleNextStep = useCallback(() => {
		setCancellationStep(4);
	}, [setCancellationStep]);

	// New handler for confirmation
	const handleConfirmCancellation = useCallback(async () => {
		try {
			await onConfirmCancellation(); // Perform the cancellation (e.g., API call)
			onClose(); // Close immediately after completion
		} catch (error) {
			console.error("Cancellation error:", error);
		}
	}, [onConfirmCancellation, onClose]);

	const renderCancellationStep = () => {
		switch (cancellationStep) {
			case 1:
				return (
					<div key='step-1'>
						<DialogHeader>
							<DialogTitle className='flex items-center text-xl'>
								<HeartCrack className='h-5 w-5 mr-2 text-amber-500' />
								Gitmeden önce bir düşün...
							</DialogTitle>
							<DialogDescription className='text-base'>
								Ayrılmanız bizi üzer. Premium aboneliğinizi iptal ettiğinizde
								neleri kaçıracağınızı biliyor musunuz?
							</DialogDescription>
						</DialogHeader>
						<div className='py-4'>
							<div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3'>
								<h4 className='font-semibold text-amber-800 dark:text-amber-200 mb-2'>
									İptal ederseniz kaybedecekleriniz:
								</h4>
								<div className='flex items-start space-x-3'>
									<Book className='h-5 w-5 text-amber-600 mt-1 flex-shrink-0' />
									<div>
										<p className='font-semibold'>Sınırsız Hikaye Erişimi</p>
										<p className='text-sm text-amber-700 dark:text-amber-300'>
											Tüm seviyelerdeki yüzlerce hikayeye erişiminizi
											kaybedersiniz.
										</p>
									</div>
								</div>
								<div className='flex items-start space-x-3'>
									<TrendingDown className='h-5 w-5 text-amber-600 mt-1 flex-shrink-0' />
									<div>
										<p className='font-semibold'>İlerleme Takibi</p>
										<p className='text-sm text-amber-700 dark:text-amber-300'>
											Öğrenme istatistikleriniz ve kelime listeleriniz
											sıfırlanabilir.
										</p>
									</div>
								</div>
								<div className='flex items-start space-x-3'>
									<Zap className='h-5 w-5 text-amber-600 mt-1 flex-shrink-0' />
									<div>
										<p className='font-semibold'>Tüm Premium Özellikler</p>
										<p className='text-sm text-amber-700 dark:text-amber-300'>
											Yapay zeka asistanı, çevrimdışı mod ve reklamsız deneyim
											gibi tüm avantajları kaybedersiniz.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className='flex justify-end gap-3'>
							<Button variant='ghost' onClick={onClose}>
								Fikrimi Değiştirdim
							</Button>
							<Button
								variant='outline'
								className='border-destructive text-destructive hover:bg-destructive/10'
								onClick={() => setCancellationStep(2)}
							>
								Yine de İptal Et <ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					</div>
				);

			case 2:
				return (
					<div key='step-2'>
						<DialogHeader>
							<DialogTitle>Neden ayrılıyorsunuz?</DialogTitle>
							<DialogDescription>
								Geri bildiriminiz hizmetimizi geliştirmemize yardımcı olur.
								Lütfen bir neden seçin.
							</DialogDescription>
						</DialogHeader>
						<div className='py-4'>
							<RadioGroup
								value={cancellationData.reason}
								onValueChange={(value) =>
									setCancellationData({ ...cancellationData, reason: value })
								}
								className='space-y-3'
							>
								{cancellationReasons.map((reason) => (
									<div
										key={reason.value}
										className='flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors'
									>
										<RadioGroupItem value={reason.value} id={reason.value} />
										<Label
											htmlFor={reason.value}
											className='flex-1 cursor-pointer'
										>
											{reason.label}
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>
						<div className='flex justify-between'>
							<Button variant='ghost' onClick={() => setCancellationStep(1)}>
								<ArrowLeft className='mr-2 h-4 w-4' /> Geri
							</Button>
							<Button
								onClick={() => setCancellationStep(3)}
								disabled={!cancellationData.reason}
							>
								Devam Et <ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					</div>
				);

			case 3:
				return (
					<div key='step-3'>
						<DialogHeader>
							<DialogTitle>Deneyiminizi iyileştirmek için</DialogTitle>
							<DialogDescription>
								Yaşadığınız sorunları anlamamıza yardımcı olun. Bu bilgiler
								ürünümüzü geliştirmek için kullanılacak.
							</DialogDescription>
						</DialogHeader>
						<div className='py-4 space-y-4'>
							<div>
								<Label htmlFor='feedback' className='text-sm font-medium'>
									Hangi konularda sorun yaşadınız? (İsteğe bağlı)
								</Label>
								<Textarea
									key='feedback-textarea'
									id='feedback'
									placeholder='Örn: Hikayeler çok kolay/zor geldi, teknik sorunlar yaşadım...'
									value={cancellationData.feedback}
									onChange={(e) =>
										setCancellationData({
											...cancellationData,
											feedback: e.target.value,
										})
									}
									className='mt-2'
								/>
							</div>
							<div>
								<Label htmlFor='improvement' className='text-sm font-medium'>
									Hangi iyileştirmeler sizi geri getirebilir? (İsteğe bağlı)
								</Label>
								<Textarea
									key='improvement-textarea'
									id='improvement'
									placeholder='Örn: Daha fazla hikaye, daha iyi fiyatlandırma, yeni özellikler...'
									value={cancellationData.improvement}
									onChange={(e) =>
										setCancellationData({
											...cancellationData,
											improvement: e.target.value,
										})
									}
									className='mt-2'
								/>
							</div>
						</div>
						<div className='flex justify-between'>
							<Button variant='ghost' onClick={() => setCancellationStep(2)}>
								<ArrowLeft className='mr-2 h-4 w-4' /> Geri
							</Button>
							<Button onClick={handleNextStep}>
								Devam Et <ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					</div>
				);

			case 4:
				return (
					<div key='step-4'>
						<DialogHeader>
							<DialogTitle className='text-red-600 dark:text-red-400 flex items-center'>
								<AlertTriangle className='h-5 w-5 mr-2' />
								Abonelik İptalini Onayla
							</DialogTitle>
							<DialogDescription>
								Bu işlem geri alınamaz. Aboneliğinizi iptal etmek istediğinizden
								emin misiniz?
							</DialogDescription>
						</DialogHeader>
						<div className='py-4'>
							<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
								<p className='text-red-800 dark:text-red-200 font-medium flex items-center'>
									<CalendarOff className='h-5 w-5 mr-3 flex-shrink-0' />
									<span>
										Aboneliğiniz{" "}
										<strong>
											{subscriptionEndDate || "bir sonraki fatura döneminde"}
										</strong>{" "}
										sonlanacak.
									</span>
								</p>
								<ul className='text-sm text-red-700 dark:text-red-300 mt-3 space-y-1 list-disc list-inside'>
									<li>
										Bu tarihe kadar tüm Premium özelliklerinizi kullanmaya devam
										edebilirsiniz.
									</li>
									<li>
										Fikrinizi değiştirirseniz, bu tarihten önce aboneliğinizi
										yeniden etkinleştirebilirsiniz.
									</li>
									<li>
										Kullanım Koşullarımızda belirtildiği gibi, mevcut fatura
										dönemi için geri ödeme yapılmaz.
									</li>
								</ul>
							</div>
						</div>
						<div className='flex justify-between'>
							<Button
								variant='ghost'
								onClick={() => setCancellationStep(3)}
								disabled={isProcessing}
							>
								<ArrowLeft className='mr-2 h-4 w-4' /> Geri
							</Button>
							<Button
								variant='destructive'
								onClick={handleConfirmCancellation} // Updated handler
								disabled={isProcessing}
							>
								{isProcessing ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : null}
								{isProcessing ? "İşleniyor..." : "Evet, İptali Onayla"}
							</Button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
		>
			<DialogContent className='sm:max-w-[500px]'>
				<div className='mb-4 pt-4'>
					<Progress value={getStepProgress()} className='h-2' />
					<p className='text-sm text-muted-foreground mt-2 text-center'>
						Adım {cancellationStep} / 4
					</p>
				</div>
				{renderCancellationStep()}
			</DialogContent>
		</Dialog>
	);
};

export default CancellationDialog;