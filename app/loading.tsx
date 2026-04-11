'use client'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center">
        {/* Animated spiral loader */}
        <svg 
          viewBox="0 0 55 34" 
          className="w-16 h-10 mx-auto mb-6 text-accent animate-pulse"
          fill="none"
        >
          <path
            d="M34 34 Q34 0 0 0 Q55 0 55 21"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-[spin_3s_linear_infinite]"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
        
        <p className="font-mono text-sm text-ink-muted uppercase tracking-widest">
          Loading...
        </p>
        
        {/* Golden ratio progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-accent"
              style={{
                animation: `bounce 1.4s ease-in-out ${i * 0.14}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
