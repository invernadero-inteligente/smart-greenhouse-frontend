import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", {
	variants: {
		variant: {
			default: "border-[var(--secondary)] bg-[var(--card-muted)] text-[var(--primary)]",
			success: "border-green-500/30 bg-green-50 text-green-700",
			warning: "border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)]",
			danger: "border-red-500/30 bg-red-50 text-red-700",
			accent: "border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)]"
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

function Badge({ className, variant, ...props }) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
