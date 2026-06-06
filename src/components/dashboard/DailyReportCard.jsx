import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Clock, CheckCircle, Target, Edit2, Save, Goal, BrainCircuit, ArrowRight, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const levels = [
  { value: 'all', label: 'Tüm Seviyeler' },
  { value: 'a1', label: 'A1 - Başlangıç' },
  { value: 'a2', label: 'A2 - Temel' },
  { value: 'b1', label: 'B1 - Orta' },
  { value: 'b2', label: 'B2 - Orta Üstü' },
  { value: 'c1', label: 'C1 - İleri' },
];

const DailyReportCard = React.memo(({ readStoryDetails, isMobile }) => {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editStep, setEditStep] = useState(0);

    const [weeklyGoal, setWeeklyGoal] = useLocalStorage('weeklyStoryGoal', 7);
    const [focusLevel, setFocusLevel] = useLocalStorage('focusLevel', 'all');

    const [tempWeeklyGoal, setTempWeeklyGoal] = useState(weeklyGoal);
    const [tempFocusLevel, setTempFocusLevel] = useState(focusLevel);

    const dailyGoal = useMemo(() => Math.ceil(weeklyGoal / 7), [weeklyGoal]);
    
    useEffect(() => {
        if (isEditing) {
            setTempWeeklyGoal(weeklyGoal);
            setTempFocusLevel(focusLevel);
        }
    }, [isEditing, weeklyGoal, focusLevel]);

    const handleSaveGoals = () => {
        if(tempWeeklyGoal < 1) {
            toast({ title: "Geçersiz Hedef", description: "Haftalık hedef 1'den küçük olamaz.", variant: "destructive" });
            return;
        }
        setWeeklyGoal(tempWeeklyGoal);
        setFocusLevel(tempFocusLevel);
        setIsEditing(false);
        setEditStep(0);
        toast({ title: "Hedefler Güncellendi!", description: "Yeni hedeflerin başarıyla kaydedildi.", variant: "success" });
    };

    const readStoriesCount = readStoryDetails.length;
    const weeklyProgress = weeklyGoal > 0 ? Math.min((readStoriesCount / weeklyGoal) * 100, 100) : 0;
    const minutesRead = useMemo(() => {
        if (!readStoryDetails) return 0;
        return readStoryDetails.reduce((total, story) => {
            const time = story?.stories?.read_time ? parseInt(story.stories.read_time) : 0;
            return total + time;
        }, 0);
    }, [readStoryDetails]);

    const StatItem = ({ icon: Icon, value, label, color }) => (
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <p className="font-bold text-xl text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
            </div>
        </div>
    );
    
    const EditView = () => (
        <Card className="h-full bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-xl">
                    <div className="flex items-center gap-2"><Goal className="text-primary"/><span>Hedeflerini Düzenle</span></div>
                     <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setEditStep(0); }}><Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary"/></Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={editStep}
                        initial={{ opacity: 0, x: editStep > 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: editStep > 0 ? -50 : 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full px-4"
                    >
                        {editStep === 0 && (
                            <div className="space-y-2 text-center">
                                <Label htmlFor="weekly-goal" className="font-semibold text-lg">Haftalık Hikaye Hedefin</Label>
                                <Input id="weekly-goal" type="number" value={tempWeeklyGoal} onChange={(e) => setTempWeeklyGoal(Math.max(1, parseInt(e.target.value) || 1))} className="h-14 text-2xl text-center font-bold" />
                            </div>
                        )}
                        {editStep === 1 && (
                            <div className="space-y-2 text-center">
                                <Label htmlFor="focus-level" className="font-semibold text-lg">Odaklanmak İstediğin Seviye</Label>
                                <Select value={tempFocusLevel} onValueChange={setTempFocusLevel}>
                                    <SelectTrigger id="focus-level" className="h-14 text-base"><SelectValue placeholder="Seviye seçin" /></SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
            <CardHeader className="pt-2">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setEditStep(s => Math.max(0, s - 1))} disabled={editStep === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Geri
                    </Button>
                    <div className="flex items-center gap-2">
                        {[0,1].map(i => (
                            <div key={i} className={`h-2 w-2 rounded-full transition-colors ${editStep === i ? 'bg-primary' : 'bg-muted'}`}></div>
                        ))}
                    </div>
                    {editStep < 1 ? (
                        <Button onClick={() => setEditStep(s => Math.min(1, s + 1))}>
                            İleri <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    ) : (
                        <Button onClick={handleSaveGoals} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-shadow">
                            <Save className="mr-2 h-4 w-4"/> Kaydet
                        </Button>
                    )}
                </div>
            </CardHeader>
        </Card>
    );

    const DisplayView = () => (
        <Card className="h-full bg-gradient-to-br from-card to-secondary/20 border-border/20 shadow-lg flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between gap-2 text-xl">
                     <div className="flex items-center gap-2"><Award className="text-primary"/><span>Günlük Rapor</span></div>
                     <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary"/></Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-foreground">
                        <span>Haftalık Hedef</span>
                        <span className="text-primary">{readStoriesCount} / {weeklyGoal}</span>
                    </div>
                    <div className="relative h-3 w-full rounded-full bg-secondary">
                        <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${weeklyProgress}%` }}
                        />
                    </div>
                </div>

                {!isMobile && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                     <StatItem icon={CheckCircle} value={readStoriesCount} label="Okunan Hikaye" color="from-green-400 to-emerald-500" />
                     <StatItem icon={Clock} value={`${minutesRead} dk`} label="Çalışma Süresi" color="from-orange-400 to-amber-500" />
                     <StatItem icon={Target} value={`~${dailyGoal}`} label="Günlük Hedef" color="from-blue-400 to-sky-500" />
                     <StatItem icon={BrainCircuit} value={levels.find(l => l.value === focusLevel)?.label.split(' ')[0] || 'Tümü'} label="Odak Seviyesi" color="from-purple-400 to-violet-500" />
                  </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="h-full w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isEditing ? 'edit' : 'display'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {isEditing ? <EditView /> : <DisplayView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
});

export default DailyReportCard;