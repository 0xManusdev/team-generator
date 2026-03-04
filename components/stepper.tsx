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
			className="mb-10 flex items-center justify-center gap-3"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, delay: 0.15 }}
		>
			{STEPS.map((s, i) => {
				const isActive = currentStep === s;
				const isCompleted = currentIndex > i;

				return (
					<div key={s} className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<motion.div
								className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
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
								className={`text-sm transition-colors duration-300 ${
									isActive
										? "font-semibold text-foreground"
										: "text-muted-foreground"
								}`}
							>
								{STEP_LABELS[s]}
							</span>
						</div>
						{i < STEPS.length - 1 && (
							<div
								className={`h-px w-10 transition-colors duration-500 ${
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
