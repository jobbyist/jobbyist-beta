interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground = ({ children }: AnimatedBackgroundProps) => {
  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 animate-gradient-shift"
        style={{
          backgroundSize: '400% 400%',
          background: `
            linear-gradient(
              45deg,
              hsl(220, 100%, 97%) 0%,
              hsl(280, 100%, 97%) 25%,
              hsl(330, 100%, 97%) 50%,
              hsl(200, 100%, 97%) 75%,
              hsl(260, 100%, 97%) 100%
            )
          `
        }}
      />
      
      {/* Secondary animated layer for more depth */}
      <div 
        className="fixed inset-0 -z-10 opacity-30 bg-gradient-to-tr from-indigo-100/50 via-rose-100/50 to-amber-100/50 dark:from-indigo-900/20 dark:via-rose-900/20 dark:to-amber-900/20 animate-gradient-rotate"
        style={{
          backgroundSize: '600% 600%',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;