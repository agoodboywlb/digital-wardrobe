import { cn } from "@/utils/cn";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "attribute" | "custom";
  color?: string;
}

export function Tag({
  children,
  className,
  type = "attribute",
  color,
  ...props
}: TagProps) {
  const isAttribute = type === "attribute";

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
        isAttribute
          ? "bg-gray-100 text-gray-700"
          : "text-white",
        className
      )}
      style={!isAttribute && color ? { backgroundColor: color } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
