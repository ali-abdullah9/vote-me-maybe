"use client";

interface StepItemProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const StepItem = ({ number, title, description, icon }: StepItemProps) => {
  return (
    <div className="relative pb-12 last:pb-0">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="flex gap-4">
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {number}
        </div>
        <div className="flex-1 pt-1">
          <div className="mb-2 flex items-center">
            <div className="mr-2 rounded-full bg-primary/10 p-1.5">
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};