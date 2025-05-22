import { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export const AnimatedShinyText = ({ children, className, shimmerWidth = 100, ...props }) => {
  const viaColors = ["via-amber-500", "via-green-500", "via-red-500", "via-pink-500", "via-indigo-500", "via-blue-500", "via-purple-500"];
  const randomlySelectedColor = viaColors[Math.floor(Math.random() * viaColors.length)];
  console.log(randomlySelectedColor);

  return (
    <span
      style={{
        "--shiny-width": `${shimmerWidth}px`,
      }}
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70 font-medium text-xs",

        // Shine effect
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        `bg-gradient-to-r from-transparent ${randomlySelectedColor} via-50% to-transparent  dark:via-white/80`,

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
