import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, Crown, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';

const QuizSetupPage = () => {
    const { user, canAccessPremiumFeatures } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [categories, setCategories] = useState([]);
    const [allWords, setAllWords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [questionCount, setQuestionCount] = useState(10);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const { data: wordsData, error: wordsError } = await supabase
                    .from('user_saved_words')
                    .select('id, word, translation, category_id')
                    .eq('user_id', user.id);

                if (wordsError) throw wordsError;
                setAllWords(wordsData || []);

                if (canAccessPremiumFeatures) {
                    const { data: categoriesData, error: categoriesError } = await supabase
                        .from('word_categories')
                        .select('*')
                        .eq('user_id', user.id);
                    if (categoriesError) throw categoriesError;
                    setCategories(categoriesData || []);
                }

            } catch (error) {
                console.error('Error fetching data for quiz setup:', error);
                toast({
                    title: "Hata",
                    description: "Quiz verileri yüklenirken bir hata oluştu.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate, toast, canAccessPremiumFeatures]);
    
    const wordsInSelectedCategory = useMemo(() => {
        if (selectedCategory === 'all') return allWords;
        return allWords.filter(word => word.category_id === parseInt(selectedCategory));
    }, [selectedCategory, allWords]);


    const handleStartQuiz = () => {
        if (wordsInSelectedCategory.length < 4) {
            toast({
                title: "Yetersiz kelime",
                description: `Quiz için en az 4 kelime gereklidir. Bu listede ${wordsInSelectedCategory.length} kelime var.`,
                variant: "destructive",
            });
            return;
        }

        const finalQuestionCount = canAccessPremiumFeatures
            ? Math.min(wordsInSelectedCategory.length, questionCount)
            : Math.min(wordsInSelectedCategory.length, 10);
        
        const quizWords = [...wordsInSelectedCategory].sort(() => 0.5 - Math.random()).slice(0, finalQuestionCount);

        navigate('/quiz', { state: { words: quizWords, allWords: allWords } });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" />
            </div>
        );
    }
    
    return (
        <>
            <Seo
                title="Quiz Ayarları"
                description="İngilizce kelime bilginizi test etmek için quiz ayarlarınızı yapın ve hemen başlayın."
                url="/quiz/setup"
                keywords="İngilizce quiz başlat, kelime testi ayarları, dil öğrenme quizi"
            />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-full max-w-lg"
                >
                    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20">
                        <CardHeader className="text-center p-8">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], color: ["#8B5CF6", "#EC4899", "#8B5CF6"] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
                            </motion.div>
                            <CardTitle className="text-3xl font-bold">Quiz'e Hazırlan</CardTitle>
                            <CardDescription className="text-lg text-muted-foreground">
                                Bilgini test etmek için ayarlarını seç ve başla!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-8">
                            {canAccessPremiumFeatures && (
                                <div className="space-y-4">
                                    <Label htmlFor="category-select" className="text-lg font-semibold flex items-center gap-2"><Layers className="h-5 w-5" /> Kelime Listesi</Label>
                                    <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                                        <SelectTrigger id="category-select" className="h-12 text-base">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tüm Kelimeler ({allWords.length})</SelectItem>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name} ({allWords.filter(w => w.category_id === cat.id).length})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="question-count" className="text-lg font-semibold">Soru Sayısı</Label>
                                    <span className="font-bold text-lg text-primary">{canAccessPremiumFeatures ? questionCount : Math.min(10, wordsInSelectedCategory.length)}</span>
                                </div>
                                <Slider
                                    id="question-count"
                                    min={5}
                                    max={canAccessPremiumFeatures ? Math.max(5, Math.min(50, wordsInSelectedCategory.length)) : Math.min(10, wordsInSelectedCategory.length)}
                                    step={canAccessPremiumFeatures ? 5 : 1}
                                    value={[questionCount]}
                                    onValueChange={(value) => setQuestionCount(value[0])}
                                    disabled={!canAccessPremiumFeatures || wordsInSelectedCategory.length < 5}
                                />
                                {!canAccessPremiumFeatures && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-amber-500" />
                                        Soru sayısını artırmak için <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/subscription')}>Premium'a geçin</Button>.
                                    </p>
                                )}
                                {wordsInSelectedCategory.length < 4 && (
                                    <p className="text-sm text-destructive">
                                        Bu listede quiz için yeterli kelime yok. (En az 4)
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <Button size="lg" className="w-full h-14 text-xl" onClick={handleStartQuiz} disabled={wordsInSelectedCategory.length < 4}>
                                    <Zap className="mr-2 h-6 w-6" />
                                    Quiz'i Başlat
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => navigate('/activities')}>Aktivitelere Geri Dön</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};

export default QuizSetupPage;