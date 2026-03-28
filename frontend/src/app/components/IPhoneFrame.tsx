import { StatusBar } from './StatusBar';

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-8">
      {/* iPhone 17 Device Frame */}
      <div className="relative">
        {/* Phone Body */}
        <div className="relative w-[393px] h-[852px] bg-black rounded-[60px] p-[3px] shadow-2xl">
          {/* Inner bezel */}
          <div className="relative w-full h-full bg-background rounded-[57px] overflow-hidden">
            {/* Status Bar */}
            <StatusBar />
            
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
              <div className="w-[126px] h-[37px] bg-black rounded-b-[20px] flex items-center justify-center gap-2">
                {/* Camera */}
                <div className="w-[10px] h-[10px] rounded-full bg-gray-900 border border-gray-800" />
                {/* Spacer */}
                <div className="w-[16px]" />
                {/* Sensors */}
                <div className="w-[6px] h-[6px] rounded-full bg-gray-900" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="w-full h-full flex flex-col">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <div className="w-[140px] h-[5px] bg-gray-900 dark:bg-gray-200 rounded-full opacity-60" />
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        {/* Volume Buttons */}
        <div className="absolute left-[-3px] top-[120px] w-[3px] h-[50px] bg-gray-900 rounded-l-sm" />
        <div className="absolute left-[-3px] top-[180px] w-[3px] h-[50px] bg-gray-900 rounded-l-sm" />
        
        {/* Power Button */}
        <div className="absolute right-[-3px] top-[150px] w-[3px] h-[80px] bg-gray-900 rounded-r-sm" />
      </div>
    </div>
  );
}