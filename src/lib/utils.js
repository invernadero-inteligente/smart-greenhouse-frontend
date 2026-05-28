import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function normalizeCreatedAt(item) {
	if (!item || typeof item !== "object") {
		return undefined;
	}

	const fields = [
		"createdAt",
		"created_at",
		"created",
		"creationDate",
		"created_on",
		"createdAtIso",
		"created_at_iso",
		"createdAtUtc",
		"createdAtUTC",
		"createdOn",
		"created_date",
		"created_on_date",
	];

	const extractFromObject = (obj) => {
		if (!obj || typeof obj !== "object") return undefined;

		for (const key of fields) {
			const value = obj[key];
			if (value !== undefined && value !== null && value !== "") {
				return value;
			}
		}

		for (const [key, value] of Object.entries(obj)) {
			if (/(^|\W)(created|creation)(\W|$)/i.test(key) && value !== undefined && value !== null && value !== "") {
				return value;
			}
		}

		return undefined;
	};

	const direct = extractFromObject(item);
	if (direct) {
		return direct;
	}

	const nestedKeys = ["data", "content", "payload", "attributes", "zone", "crop", "item"];
	for (const key of nestedKeys) {
		const nested = item[key];
		if (nested && typeof nested === "object" && nested !== item && !Array.isArray(nested)) {
			const nestedValue = normalizeCreatedAt(nested);
			if (nestedValue) {
				return nestedValue;
			}
		}
	}

	if (item.sowingDate) {
		return item.sowingDate;
	}

	return undefined;
}
