import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';
import { Howl } from 'howler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const TIME_PER_QUESTION = 15;
const NEXT_QUESTION_DELAY = 1200;

let sounds;
if (typeof window !== 'undefined') {
    sounds = {
        correct: new Howl({ src: ['/sounds/correct.mp3'], volume: 0.3, preload: true }),
        wrong: new Howl({ src: ['/sounds/wrong.mp3'], volume: 0.3, preload: true }),
        excitement: new Howl({ src: ['/sounds/excitement.mp3'], volume: 0.5, preload: true }),
    };
}

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, preferences } = useAuth();
    const { toast } = useToast();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [quizFinished, setQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    
    const nextQuestionTimerRef = useRef(null);
    const intervalRef = useRef(null);
    
    const playSound = useCallback((sound) => {
        if (sounds && preferences?.soundEffects) {
            sounds[sound].play();
        }
    }, [preferences?.soundEffects]);

    const handleNextQuestion = useCallback(() => {
        if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
        
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setQuizFinished(true);
            playSound('excitement');
        }
    }, [currentQuestionIndex, questions.length, playSound]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const handleAnswer = useCallback((answer) => {
        if (isAnswered) return;

        stopTimer();
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const isCorrect = answer === currentQuestion.correctAnswer;
        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (isCorrect) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            playSound('correct');
        } else {
            setStreak(0);
            playSound('wrong');
        }

        nextQuestionTimerRef.current = setTimeout(handleNextQuestion, NEXT_QUESTION_DELAY);
    }, [isAnswered, questions, currentQuestionIndex, handleNextQuestion, playSound, stopTimer]);

    const startTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(TIME_PER_QUESTION);
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopTimer();
                    handleAnswer(null); // Timeout means wrong/no answer
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [stopTimer, handleAnswer]);

    useEffect(() => {
        if (location.state?.words && location.state?.allWords) {
            const generatedQuestions = location.state.words.map(correctWord => {
                const wrongOptions = [...location.state.allWords]
                    .filter(w => w.id !== correctWord.id && w.translation)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(w => w.translation);
                
                const options = [...wrongOptions, correctWord.translation].sort(() => 0.5 - Math.random());
                
                return {
                    word: correctWord.word,
                    correctAnswer: correctWord.translation,
                    options: options,
                    originalWord: correctWord
                };
            });
            setQuestions(generatedQuestions);
            setLoading(false);
        } else {
            toast({
                title: "Quiz Başlatılamadı",
                description: "Quiz verileri eksik. Lütfen tekrar deneyin.",
                variant: "destructive"
            });
            navigate('/quiz/setup', { replace: true });
        }
    }, [location.state, navigate, toast]);

    useEffect(() => {
        if (!loading && !quizFinished && !isAnswered) {
            startTimer();
        }
        return stopTimer;
    }, [loading, currentQuestionIndex, quizFinished, isAnswered, startTimer, stopTimer]);

    const saveAttempt = useCallback(async () => {
        if (!user) return;
        try {
            const { error } = await supabase.from('user_quiz_attempts').insert({
                user_id: user.id,
                score: score,
                total_questions: questions.length,
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error saving quiz attempt:', error);
            toast({ title: 'Hata', description: 'Quiz sonucu kaydedilemedi.', variant: 'destructive' });
        }
    }, [user, score, questions.length, toast]);

    useEffect(() => {
        if (quizFinished) {
            saveAttempt();
        }
    }, [quizFinished, saveAttempt]);
    
    useEffect(() => {
        return () => {
            if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
            stopTimer();
        };
    }, [stopTimer]);

    const handleRestart = () => {
        navigate('/quiz/setup', { replace: true });
    };

    const handleExit = () => setShowExitConfirm(true);

    const confirmExit = () => navigate('/activities');
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <Seo title="Quiz" description="Bilginizi test edin!" />
            <div className="min-h-screen w-full bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col items-center justify-center p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    {!quizFinished && currentQuestion ? (
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full max-w-2xl"
                        >
                            <QuizQuestion
                                question={currentQuestion}
                                onAnswerSelect={handleAnswer}
                                isAnswered={isAnswered}
                                selectedAnswer={selectedAnswer}
                                timeLeft={timeLeft}
                                score={score}
                                streak={streak}
                                currentQuestionIndex={currentQuestionIndex}
                                totalQuestions={questions.length}
                                onExit={handleExit}
                            />
                        </motion.div>
                    ) : (
                        quizFinished && (
                            <QuizResult
                                score={score}
                                totalQuestions={questions.length}
                                onRestart={handleRestart}
                                onBackToActivities={confirmExit}
                            />
                        )
                    )}
                </AnimatePresence>
            </div>

            <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Quiz'den ayrılmak istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Mevcut ilerlemeniz kaydedilmeyecek. Yine de devam etmek istiyor musunuz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmExit} className="bg-destructive hover:bg-destructive/90">Ayrıl</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default QuizPage;