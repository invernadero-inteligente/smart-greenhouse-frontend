import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]",
	{
		variants: {
			variant: {
				default: "bg-[var(--primary)] text-white hover:bg-[var(--secondary)]",
				secondary: "border border-[var(--secondary)] bg-white text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-white",
				destructive: "bg-red-500 text-white hover:bg-red-400",
				ghost: "text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-white"
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-lg px-3",
				lg: "h-11 px-6",
				icon: "h-10 w-10"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
