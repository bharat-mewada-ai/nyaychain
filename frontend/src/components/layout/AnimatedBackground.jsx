import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">

      {/* 
        DEEP BLUE & GREEN FLOW BACKGROUND
        A seamless looped abstract background composed of large morphing gradients.
        Designed for a light theme, so the colors are soft and don't overwhelm text.
      */}

      {/* Main Flowing Shape 1 (Royal Blue) */}
      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-40 blur-[100px]"
        style={{
          background: 'linear-gradient(135deg, #2c1414ff, #d4c2b2ff)',
          width: '80vw',
          height: '80vw',
          left: '-20%',
          top: '-20%',
        }}
        animate={{
          x: ['0%', '10%', '-5%', '0%'],
          y: ['0%', '15%', '5%', '0%'],
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 45, 90, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Main Flowing Shape 2 (Deep Teal / Green) */}
      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-30 blur-[120px]"
        style={{
          background: 'linear-gradient(135deg, #047857, #10b981)',
          width: '70vw',
          height: '70vw',
          right: '-10%',
          top: '20%',
        }}
        animate={{
          x: ['0%', '-15%', '10%', '0%'],
          y: ['0%', '-10%', '15%', '0%'],
          scale: [1, 1.15, 0.9, 1],
          rotate: [0, -45, -90, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* Flowing Shape 3 (Light Sky Blue / Accent) */}
      <motion.div
        className="absolute rounded-full mix-blend-multiply opacity-40 blur-[100px]"
        style={{
          background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
          width: '60vw',
          height: '60vw',
          left: '20%',
          bottom: '-30%',
        }}
        animate={{
          x: ['0%', '20%', '-10%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
          scale: [1, 0.9, 1.1, 1],
          rotate: [0, 90, 0, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />

      {/* Light Theme Glass Overlay: Ensures absolute readability constraint */}
      {/* A stark white overlay with high translucency that washes out the deep colors beneath into soft pastel flows, creating a gorgeous low-contrast fluid background */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[40px] z-10" />

      {/* Extreme top-layer subtle vignette to give it a premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.7)_100%)] z-20" />
    </div>
  );
}
