import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FormWrapperProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function FormWrapper({
  children,
  title,
  className = "",
}: FormWrapperProps) {
  return (
    <div className="lg:col-span-2">
      <Card className={`relative h-full ${className}`} style={{ zIndex: 1000 }}>
        <div className="p-6">
          {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
          {children}
        </div>
      </Card>
    </div>
  );
}
