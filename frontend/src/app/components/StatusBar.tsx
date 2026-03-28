import { Wifi, Battery } from 'lucide-react';

export function StatusBar() {
  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="absolute top-0 left-0 right-0 z-40 px-8 pt-3 pb-1">
      <div className="flex items-center justify-between text-foreground">
        {/* Left side - Time */}
        <div className="flex-1">
          <span className="text-sm font-semibold">{currentTime}</span>
        </div>

        {/* Right side - Status icons */}
        <div className="flex items-center gap-1.5">
          {/* Cellular Signal */}
          <div className="flex items-end gap-[2px]">
            <div className="w-[3px] h-[4px] bg-foreground rounded-sm" />
            <div className="w-[3px] h-[6px] bg-foreground rounded-sm" />
            <div className="w-[3px] h-[8px] bg-foreground rounded-sm" />
            <div className="w-[3px] h-[10px] bg-foreground rounded-sm" />
          </div>

          {/* WiFi */}
          <Wifi className="w-4 h-4" strokeWidth={2.5} />

          {/* Battery */}
          <div className="flex items-center gap-1">
            <Battery className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
