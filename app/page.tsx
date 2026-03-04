"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";
import { Stepper } from "@/components/stepper";
import { UploadStep } from "@/components/upload-step";
import { ConfigureStep } from "@/components/configure-step";
import { ResultsStep } from "@/components/results-step";
import { useTeamMaker } from "@/lib/use-team-maker";
import { errorBanner } from "@/lib/animations";

export default function Home() {
	const {
		step,
		students,
		filieres,
		filiereCounts,
		fileName,
		teamSize,
		constraints,
		teams,
		unassigned,
		error,
		setTeamSize,
		handleFile,
		updateConstraint,
		handleGenerate,
		handleDownloadPDF,
		handleReset,
		handleReconfigure,
	} = useTeamMaker();

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-2xl px-4 py-10">
				{/* Header */}
				<motion.div
					className="mb-10 text-center"
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<h1 className="text-4xl font-bold tracking-tight">
						Team Maker
					</h1>
					<p className="mt-3 text-base text-muted-foreground">
						Uploadez un fichier Excel, configurez vos contraintes
						et générez vos équipes.
					</p>
				</motion.div>

				<Stepper currentStep={step} />

				{/* Error banner */}
				<AnimatePresence>
					{error && (
						<motion.div
							variants={errorBanner}
							initial="initial"
							animate="animate"
							exit="exit"
							className="flex items-center gap-2 overflow-hidden rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
						>
							<AlertCircle className="h-4 w-4 shrink-0" />
							{error}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Step content */}
				<AnimatePresence mode="wait">
					{step === "upload" && (
						<UploadStep onFile={handleFile} />
					)}

					{step === "configure" && (
						<ConfigureStep
							fileName={fileName}
							studentCount={students.length}
							filieres={filieres}
							filiereCounts={filiereCounts}
							teamSize={teamSize}
							constraints={constraints}
							onTeamSizeChange={setTeamSize}
							onConstraintChange={updateConstraint}
							onGenerate={handleGenerate}
							onReset={handleReset}
						/>
					)}

					{step === "results" && (
						<ResultsStep
							teams={teams}
							unassigned={unassigned}
							totalStudents={students.length}
							onDownloadPDF={handleDownloadPDF}
							onReconfigure={handleReconfigure}
							onReset={handleReset}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
