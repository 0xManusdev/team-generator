import type { Variants } from "motion/react";

export const pageTransition: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

export const cardStagger: Variants = {
	animate: {
		transition: { staggerChildren: 0.1 },
	},
};

export const cardItem: Variants = {
	initial: { opacity: 0, y: 16 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

export const badgeItem: Variants = {
	initial: { opacity: 0, scale: 0.85 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, ease: "easeOut" },
	},
};

export const constraintRow: Variants = {
	initial: { opacity: 0, x: -12 },
	animate: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.3, ease: "easeOut" },
	},
};

export const tableRow: Variants = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { duration: 0.25 },
	},
};

export const errorBanner: Variants = {
	initial: { opacity: 0, height: 0, marginBottom: 0 },
	animate: {
		opacity: 1,
		height: "auto",
		marginBottom: 24,
		transition: { duration: 0.3, ease: "easeOut" },
	},
	exit: {
		opacity: 0,
		height: 0,
		marginBottom: 0,
		transition: { duration: 0.2, ease: "easeIn" },
	},
};

export const EASE_OUT_QUART = [0.25, 0.46, 0.45, 0.94] as const;
