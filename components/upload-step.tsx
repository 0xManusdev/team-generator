"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { pageTransition, EASE_OUT_QUART } from "@/lib/animations";

interface UploadStepProps {
	onFile: (file: File) => void;
}

export function UploadStep({ onFile }: UploadStepProps) {
	const [dragActive, setDragActive] = useState(false);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setDragActive(false);
			const file = e.dataTransfer.files[0];
			if (file) onFile(file);
		},
		[onFile]
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) onFile(file);
		},
		[onFile]
	);

	return (
		<motion.div
			key="upload"
			variants={pageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileSpreadsheet className="h-5 w-5" />
						Importer le fichier Excel
					</CardTitle>
					<CardDescription>
						Le fichier doit contenir les colonnes :{" "}
						<strong>Nom</strong>, <strong>Prénom</strong> et{" "}
						<strong>Filière</strong>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<motion.div
						onDragOver={(e) => {
							e.preventDefault();
							setDragActive(true);
						}}
						onDragLeave={() => setDragActive(false)}
						onDrop={handleDrop}
						animate={
							dragActive ? { scale: 1.01 } : { scale: 1 }
						}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25,
						}}
						className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-14 transition-colors duration-200 ${
							dragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-primary/50"
						}`}
					>
						<motion.div
							animate={
								dragActive
									? { y: -4, scale: 1.05 }
									: { y: 0, scale: 1 }
							}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}
						>
							<Upload className="mb-4 h-10 w-10 text-muted-foreground" />
						</motion.div>
						<p className="mb-2 text-sm font-medium">
							Glissez-déposez votre fichier ici
						</p>
						<p className="mb-5 text-xs text-muted-foreground">
							ou cliquez pour sélectionner (.xlsx, .xls, .csv)
						</p>
						<Label htmlFor="file-upload">
							<Button
								variant="outline"
								className="cursor-pointer"
								asChild
							>
								<motion.span
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.97 }}
								>
									Choisir un fichier
								</motion.span>
							</Button>
						</Label>
						<input
							id="file-upload"
							type="file"
							accept=".xlsx,.xls,.csv"
							onChange={handleFileInput}
							className="hidden"
						/>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
