"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { type Step, STEPS } from "@/lib/use-team-maker";

const STEP_LABELS: Record<Step, string> = {
	upload: "Upload",
	configure: "Configuration",
	results: "Résultats",
};

interface StepperProps {
	currentStep: Step;
}

export function Stepper({ currentStep }: StepperProps) {
	const currentIndex = STEPS.indexOf(currentStep);

	return (
		<motion.div
			className="mb-10 flex w-full max-w-md mx-auto items-center justify-between"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, delay: 0.15 }}
		>
			{STEPS.map((s, i) => {
				const isActive = currentStep === s;
				const isCompleted = currentIndex > i;

				return (
					<div
						key={s}
						className={`flex min-w-0 items-center ${
							i < STEPS.length - 1 ? "flex-1" : ""
						}`}
					>
						{/* Circle + label column */}
						<div className="flex shrink-0 flex-col items-center gap-1 sm:flex-row sm:gap-2">
							<motion.div
								className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 ${
									isActive
										? "bg-primary text-primary-foreground"
										: isCompleted
											? "bg-primary/15 text-primary"
											: "bg-muted text-muted-foreground"
								}`}
								animate={
									isActive
										? { scale: [1, 1.08, 1] }
										: { scale: 1 }
								}
								transition={{
									duration: 0.4,
									ease: "easeInOut",
								}}
							>
								{isCompleted ? (
									<CheckCircle2 className="h-4 w-4" />
								) : (
									i + 1
								)}
							</motion.div>
							<span
								className={`text-[10px] sm:text-sm leading-tight text-center transition-colors duration-300 ${
									isActive
										? "font-semibold text-foreground"
										: "text-muted-foreground"
								}`}
							>
								{STEP_LABELS[s]}
							</span>
						</div>

						{/* Connector line */}
						{i < STEPS.length - 1 && (
							<div
								className={`h-px flex-1 min-w-3 sm:min-w-4 mx-2 sm:mx-3 -translate-y-2.5 sm:translate-y-0 transition-colors duration-500 ${
									currentIndex > i
										? "bg-primary/30"
										: "bg-border"
								}`}
							/>
						)}
					</div>
				);
			})}
		</motion.div>
	);
}
