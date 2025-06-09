import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { memo, useId } from "react";
import { cn } from "@/lib";

type BaseOption = {
  label: string;
  value: string;
};

type SwitchCustomProps<T extends BaseOption> = {
  height?: string;
  options: T[];
  selected: string;
  disabled?: boolean;
  size?: "small" | "medium" | "default";
  className?: string;
  rounded?: "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-2xl";
  onClick: (value: T) => void;
};

const SwitchCustom = <T extends BaseOption>({
  options,
  selected,
  disabled,
  className,
  rounded = "rounded-2xl",
  onClick,
}: SwitchCustomProps<T>) => {
  const layoutId = useId();

  return (
    <Tabs value={selected} className="w-full  flex items-center justify-center">
      <TabsList className={cn("w-full", className, rounded)}>
        {options.map((option) => (
          <TabsTrigger
            disabled={disabled}
            key={option.value}
            value={option.value}
            className={cn("relative h-full w-full bg-transparent", rounded)}
            onClick={() => onClick(option)}
          >
            <span className="relative z-10 min-w-8">{option.label}</span>
            {selected === option.value && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", duration: 0.5 }}
                className={cn(
                  "absolute inset-0 bg-white shadow-custom",
                  rounded
                )}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default memo(SwitchCustom) as typeof SwitchCustom;
