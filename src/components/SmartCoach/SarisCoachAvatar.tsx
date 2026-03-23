import { motion } from 'framer-motion';
import coachPointing from '@/assets/saris-coach-fullbody.png';
import coachIdle from '@/assets/saris-coach-idle.png';
import coachSpeaking from '@/assets/saris-coach-speaking.png';
import coachCelebrating from '@/assets/saris-coach-celebrating.png';
import coachThinking from '@/assets/saris-coach-thinking.png';
import coachWaving from '@/assets/saris-coach-waving.png';

export type CoachAnimState = 'idle' | 'walking' | 'speaking' | 'pointing' | 'celebrating' | 'guiding' | 'thinking' | 'waving';

interface SarisCoachAvatarProps {
  state: CoachAnimState;
  size?: number;
  className?: string;
}

const stateToImage: Record<CoachAnimState, string> = {
  idle: coachIdle,
  walking: coachWaving,
  speaking: coachSpeaking,
  pointing: coachPointing,
  celebrating: coachCelebrating,
  guiding: coachSpeaking,
  thinking: coachThinking,
  waving: coachWaving,
};

export default function SarisCoachAvatar({ state, size = 120, className = '' }: SarisCoachAvatarProps) {
  const imgSrc = stateToImage[state];

  const bodyMotion = {
    idle: { y: [0, -4, 0], scale: [1, 1.01, 1] },
    walking: { y: [0, -5, 0, -5, 0], x: [0, 3, 0, -3, 0] },
    speaking: { y: [0, -2, 0], scale: [1, 1.02, 1] },
    pointing: { y: [0, -2, 0], rotate: [0, -1, 0, 1, 0] },
    celebrating: { y: [0, -12, 0, -8, 0], scale: [1, 1.08, 1, 1.05, 1], rotate: [0, 3, -3, 0] },
    guiding: { y: [0, -2, 0], x: [0, 2, 0, -2, 0] },
    thinking: { y: [0, -2, 0], rotate: [0, -2, 0] },
    waving: { y: [0, -3, 0], rotate: [0, 2, -2, 0] },
  };

  const transitionConfig: Record<CoachAnimState, object> = {
    idle: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    walking: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    speaking: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    pointing: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    celebrating: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
    guiding: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    thinking: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    waving: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`} style={{ width: size, height: size * 1.2 }}>
      {/* Ground shadow */}
      <div
        className="absolute bottom-0 rounded-full bg-black/10 blur-md"
        style={{ width: size * 0.6, height: size * 0.08 }}
      />

      <motion.img
        src={imgSrc}
        alt="سارِس — المدرب الذكي"
        className="object-contain drop-shadow-lg"
        style={{ width: size, height: size * 1.15 }}
        animate={bodyMotion[state]}
        transition={transitionConfig[state]}
      />

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div className="absolute -top-2 right-0 flex gap-1">
          {[0, 0.3, 0.6].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-saris-orange"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, delay, repeat: Infinity }}
            />
          ))}
        </div>
      )}

      {/* Celebration particles */}
      {state === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: '10%', top: '10%', delay: 0 },
            { left: '80%', top: '5%', delay: 0.2 },
            { left: '5%', top: '40%', delay: 0.4 },
            { left: '85%', top: '35%', delay: 0.1 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-saris-orange"
              style={{ left: p.left, top: p.top }}
              animate={{ opacity: [0, 1, 0], y: [0, -20, -40], scale: [0, 1, 0] }}
              transition={{ duration: 1, delay: p.delay, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
