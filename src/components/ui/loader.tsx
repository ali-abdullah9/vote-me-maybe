// src/components/ui/loader.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva(
  "inline-block rounded-full border-4 animate-spin",
  {
    variants: {
      size: {
        default: "h-8 w-8",
        sm: "h-4 w-4",
        lg: "h-12 w-12",
      },
      variant: {
        default: "border-r-primary border-t-primary border-l-primary/30 border-b-primary/30",
        secondary: "border-r-secondary border-t-secondary border-l-secondary/30 border-b-secondary/30",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof loaderVariants> {}

export function Loader({ className, size, variant, ...props }: LoaderProps) {
  return (
    <div
      className={cn(loaderVariants({ size, variant }), className)}
      {...props}
    />
  );
}