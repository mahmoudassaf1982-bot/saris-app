import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Send, X, Lightbulb, MessageCircle, Minimize2, HelpCircle, RotateCcw } from 'lucide-react';
import { useSmartCoach } from './SmartCoachContext';
import SarisCoachAvatar from './SarisCoachAvatar';
import type { CoachAnimState } from './SarisCoachAvatar';
import { idleGreetings, pickRandom } from './coachMessages';

// Mock user for PWA (no AuthContext yet)
const user = { id: 'mock', firstName: 'طالب' };

// Mock responses for when Supabase is not connected
const MOCK_RESPONSES: Record<string, string> = {
  'أعطني تلميحاً': 'حاول التفكير في المسألة بطريقة مختلفة. راجع القوانين الأساسية المتعلقة بالموضوع وطبّقها خطوة بخطوة.',
  'اشرح المفهوم': 'هذا المفهوم يعتمد على فهم العلاقات الأساسية بين المتغيرات. حاول رسم المسألة أو تقسيمها لخطوات أصغر.',
  'لماذا إجابتي خاطئة؟': 'قد يكون هناك خطأ في تطبيق القاعدة أو في فهم المطلوب. أعد قراءة السؤال بتركيز وتحقق من كل خطوة.',
  'أين أجد التدريب الذكي؟': 'اذهب لصفحة الاختبارات واختر "تدريب ذكي" — المحرك الذكي سيختار أسئلة تناسب مستواك ويركز على نقاط ضعفك.',
  'كيف أحسن درجتي؟': 'ركّز على نقاط الضعف في تحليل الأداء، ودرّب يومياً 15 دقيقة على الأقل. التدريب الذكي يساعدك تحسّن أسرع.',
  'اشرح لي الاختبار': 'الاختبار يتكون من أقسام متعددة. اختبار SARIS الحقيقي يحاكي الاختبار الفعلي بمؤقت تنازلي، والتدريب الذكي يتكيّف مع مستواك.',
};

function getMockResponse(msg: string): string {
  if (MOCK_RESPONSES[msg]) return MOCK_RESPONSES[msg];
  for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
    if (msg.includes(key) || key.includes(msg)) return value;
  }
  return 'أنا هنا لمساعدتك! يمكنك سؤالي عن أي شيء يتعلق بالاختبارات والتدريب. سيتم ربطي بالذكاء الاصطناعي قريباً لتقديم إجابات أكثر تفصيلاً.';
}

// Quick actions based on context
const sessionQuickActions = [
  { label: 'أعطني تلميحاً', icon: '💡' },
  { label: 'اشرح المفهوم', icon: '📖' },
  { label: 'لماذا إجابتي خاطئة؟', icon: '❌' },
];

const generalQuickActions = [
  { label: 'أين أجد التدريب الذكي؟', icon: '🎯' },
  { label: 'كيف أحسن درجتي؟', icon: '📈' },
  { label: 'اشرح لي الاختبار', icon: '📝' },
];

const SmartCoachFloating = () => {
  const {
    visualState, setVisualState,
    chatOpen, setChatOpen,
    messages, addMessage, updateLastCoachMessage, clearMessages,
    sessionActive,
    intervention, dismissIntervention,
    visible, showIntro, setShowIntro,
  } = useSmartCoach();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [animState, setAnimState] = useState<CoachAnimState>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const hasGreeted = useRef(false);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome greeting on first mount
  useEffect(() => {
    if (!hasGreeted.current && visible) {
      hasGreeted.current = true;
      const timer = setTimeout(() => {
        const greeting = pickRandom(idleGreetings);
        setSpeechBubble(greeting.ar);
        setShowWelcome(true);
        setTimeout(() => {
          setSpeechBubble(null);
          setShowWelcome(false);
        }, 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Update anim state based on visual state
  useEffect(() => {
    switch (visualState) {
      case 'attention':
        setAnimState('thinking');
        break;
      case 'intervention':
        setAnimState('pointing');
        break;
      case 'conversation':
        setAnimState('speaking');
        break;
      default:
        if (!loading) setAnimState('idle');
    }
  }, [visualState, loading]);

  // Intervention speech bubble
  useEffect(() => {
    if (intervention) {
      setSpeechBubble(intervention.message);
    } else {
      if (visualState !== 'conversation') setSpeechBubble(null);
    }
  }, [intervention, visualState]);

  const sendMessage = useCallback(async (msg: string) => {
    if (!msg || loading) return;
    addMessage({ role: 'user', content: msg });
    setInput('');
    setLoading(true);
    setAnimState('speaking');
    addMessage({ role: 'coach', content: 'لحظة واحدة…' });

    // Mock: simulate network delay then return mock response
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const reply = getMockResponse(msg);
    updateLastCoachMessage(reply);
    setLoading(false);
    setAnimState('idle');
  }, [loading, addMessage, updateLastCoachMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim());
  };

  const handleQuickAction = (label: string) => {
    sendMessage(label);
  };

  const handleCharacterClick = () => {
    if (intervention) {
      dismissIntervention();
      setChatOpen(true);
      setVisualState('conversation');
      return;
    }
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setVisualState('conversation');
      setSpeechBubble(null);
    } else {
      setVisualState('idle');
    }
  };

  const handleClose = () => {
    setChatOpen(false);
    setVisualState('idle');
    setSpeechBubble(null);
  };

  if (!visible || !user) return null;

  const quickActions = sessionActive ? sessionQuickActions : generalQuickActions;

  return (
    <>
      {/* Drag constraints */}
      <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" />

      {/* ====== CHAT PANEL ====== */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-tajawal font-bold text-sm text-foreground">المدرب الذكي سارِس</h3>
                  <p className="font-tajawal text-[10px] text-muted-foreground">
                    {loading ? 'يكتب...' : 'متصل'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => clearMessages()}
                  className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="مسح المحادثة"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="تصغير"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-[120px] max-h-[300px]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <SarisCoachAvatar state="waving" size={64} />
                  <p className="font-tajawal text-xs text-muted-foreground mt-2">
                    مرحباً! أنا سارِس، مدربك الذكي. كيف أقدر أساعدك؟
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 font-tajawal text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  disabled={loading}
                  className="bg-muted hover:bg-accent rounded-full px-2.5 py-1 font-tajawal text-[11px] text-foreground transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 pb-3">
              <div className="flex items-center gap-2 bg-muted rounded-xl border border-border px-3 py-1.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 bg-transparent font-tajawal text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  dir="rtl"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== FLOATING CHARACTER ====== */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.08}
        dragControls={dragControls}
        className="fixed bottom-20 left-4 z-40 cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.92 }}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {speechBubble && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-3 py-2 shadow-lg max-w-[200px] z-10"
            >
              <p className="font-tajawal text-[11px] text-foreground leading-relaxed">{speechBubble}</p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b border-r border-border rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intervention overlay */}
        <AnimatePresence>
          {intervention && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 bg-card border-2 border-primary/30 rounded-xl px-3 py-2 shadow-lg max-w-[220px] z-10"
            >
              <div className="flex items-start gap-1.5">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="font-tajawal text-[11px] text-foreground leading-relaxed">{intervention.message}</p>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b border-r border-primary/30 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character button */}
        <button
          onClick={handleCharacterClick}
          className="relative block"
          aria-label="المدرب الذكي سارِس"
        >
          {/* Attention glow */}
          {visualState === 'attention' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Intervention glow */}
          {visualState === 'intervention' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          <img
            src="/coach/saris-coach-idle.png"
            alt="سارِس"
            className="w-16 h-16 object-contain drop-shadow-lg pointer-events-none"
          />

          {/* Lightbulb badge (intervention) */}
          {intervention && !chatOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md"
            >
              <Lightbulb className="w-3.5 h-3.5 text-primary-foreground" />
            </motion.div>
          )}

          {/* Chat indicator */}
          {!chatOpen && !intervention && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-primary-foreground" />
            </div>
          )}

          {/* Help badge (attention state) */}
          {visualState === 'attention' && !chatOpen && !intervention && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -left-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
            >
              <HelpCircle className="w-3 h-3 text-destructive-foreground" />
            </motion.div>
          )}
        </button>
      </motion.div>
    </>
  );
};

export default SmartCoachFloating;
