import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Calendar, 
  Vote, 
  MapPin, 
  CreditCard, 
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoteStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  text: string;
  ctaText?: string;
  ctaAction?: () => void;
  isFinal?: boolean;
}

const voteSteps: VoteStep[] = [
  {
    id: 1,
    title: 'Check Registration',
    icon: <CheckCircle className="w-12 h-12" />,
    text: "Make sure you're registered before the deadline.",
    ctaText: 'Check Status',
    ctaAction: () => console.log('Check registration status'),
  },
  {
    id: 2,
    title: 'Know the Election',
    icon: <Calendar className="w-12 h-12" />,
    text: "Learn the date, candidates, and what's on the ballot.",
  },
  {
    id: 3,
    title: 'Choose Your Method',
    icon: <Vote className="w-12 h-12" />,
    text: 'Vote in person, early, or by mail.',
  },
  {
    id: 4,
    title: 'Find Your Location',
    icon: <MapPin className="w-12 h-12" />,
    text: 'Look up where and when to vote.',
    ctaText: 'View Map',
    ctaAction: () => console.log('View polling place map'),
  },
  {
    id: 5,
    title: 'Bring Identification',
    icon: <CreditCard className="w-12 h-12" />,
    text: 'Check what ID you need before you go.',
  },
  {
    id: 6,
    title: 'Cast Your Vote',
    icon: <CheckCheck className="w-12 h-12" />,
    text: 'Fill out your ballot and submit it.',
    isFinal: true,
  },
];

interface HowToVoteGuideProps {
  onClose: () => void;
}

export function HowToVoteGuide({ onClose }: HowToVoteGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < voteSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - show success
      setShowSuccess(true);
      triggerConfetti();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSwipe = (offset: number) => {
    if (offset < -50 && currentStep < voteSteps.length - 1) {
      handleNext();
    } else if (offset > 50 && currentStep > 0) {
      handleBack();
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const step = voteSteps[currentStep];
  const progress = ((currentStep + 1) / voteSteps.length) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex-1">
          <h1 
            className="text-xl" 
            style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
          >
            How to Vote Guide
          </h1>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {voteSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="flex justify-center gap-2 px-4 py-3">
        {voteSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-primary'
                : index < currentStep
                ? 'w-2 bg-primary/60'
                : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Card Content */}
      <div className="flex-1 overflow-hidden relative px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => handleSwipe(info.offset.x)}
            className="h-full flex items-center justify-center"
          >
            {showSuccess && step.isFinal ? (
              <SuccessCard onClose={onClose} />
            ) : (
              <StepCard step={step} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              currentStep === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {currentStep === voteSteps.length - 1 ? 'Complete' : 'Next'}
            {currentStep < voteSteps.length - 1 && <ChevronRight className="w-5 h-5" />}
            {currentStep === voteSteps.length - 1 && <CheckCheck className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }: { step: VoteStep }) {
  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-3xl p-8 shadow-lg"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          {step.icon}
        </motion.div>

        {/* Title */}
        <h2
          className="text-2xl text-center mb-4"
          style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
        >
          {step.title}
        </h2>

        {/* Description */}
        <p className="text-center text-muted-foreground text-lg leading-relaxed mb-6">
          {step.text}
        </p>

        {/* CTA Button */}
        {step.ctaText && step.ctaAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={step.ctaAction}
            className="w-full py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-all"
          >
            {step.ctaText}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

function SuccessCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary rounded-3xl p-8 shadow-lg relative overflow-hidden"
      >
        {/* Animated background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"
        />

        <div className="relative z-10">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 shadow-lg border-2 border-primary"
          >
            <div className="text-center">
              <div className="text-6xl mb-2">🗳️</div>
              <h3
                className="text-xl mb-1"
                style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
              >
                I Voted
              </h3>
              <p className="text-sm text-muted-foreground">March 28, 2026</p>
            </div>
          </motion.div>

          {/* Title */}
          <h2
            className="text-2xl text-center mb-4"
            style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
          >
            You're All Set! 🎉
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground text-base leading-relaxed mb-6">
            You now have all the information you need to make your voice heard. Remember to vote on election day!
          </p>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all"
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}