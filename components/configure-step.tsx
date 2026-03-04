"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FileSpreadsheet, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmGenerateDialog } from "@/components/confirm-generate-dialog";
import {
	pageTransition,
	cardStagger,
	cardItem,
	badgeItem,
	constraintRow,
	EASE_OUT_QUART,
} from "@/lib/animations";
import type { FiliereConstraint } from "@/lib/team-maker";

interface ConfigureStepProps {
	fileName: string;
	studentCount: number;
	filieres: string[];
	filiereCounts: Record<string, number>;
	teamSize: number;
	constraints: FiliereConstraint[];
	onTeamSizeChange: (size: number) => void;
	onConstraintChange: (filiere: string, count: number) => void;
	onGenerate: () => void;
	onReset: () => void;
}

export function ConfigureStep({
	fileName,
	studentCount,
	filieres,
	filiereCounts,
	teamSize,
	constraints,
	onTeamSizeChange,
	onConstraintChange,
	onGenerate,
	onReset,
}: ConfigureStepProps) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const totalConstrained = constraints.reduce((s, c) => s + c.count, 0);
	const remainingSlots = teamSize - totalConstrained;

	return (
		<motion.div
			key="configure"
			variants={pageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
		>
			<motion.div
				className="space-y-6"
				variants={cardStagger}
				initial="initial"
				animate="animate"
			>
				{/* File summary */}
				<motion.div variants={cardItem}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileSpreadsheet className="h-5 w-5" />
								Fichier importé
							</CardTitle>
							<CardDescription>
								<strong>{fileName}</strong> &mdash;{" "}
								{studentCount} étudiants dans{" "}
								{filieres.length} filières
							</CardDescription>
						</CardHeader>
						<CardContent>
							<motion.div
								className="flex flex-wrap gap-2"
								variants={cardStagger}
								initial="initial"
								animate="animate"
							>
								{filieres.map((f, i) => (
									<motion.span
										key={f}
										variants={badgeItem}
										transition={{ delay: i * 0.05 }}
									>
										<Badge variant="secondary">
											{f}: {filiereCounts[f]} étudiants
										</Badge>
									</motion.span>
								))}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Configuration */}
				<motion.div variants={cardItem}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Configuration des équipes
							</CardTitle>
							<CardDescription>
								Définissez la taille des équipes et le nombre
								d&apos;étudiants de chaque filière par équipe.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="max-w-xs">
								<Label htmlFor="team-size">
									Taille des équipes
								</Label>
								<Input
									id="team-size"
									type="number"
									min={2}
									max={20}
									value={teamSize}
									onChange={(e) =>
										onTeamSizeChange(
											Number(e.target.value)
										)
									}
									className="mt-1.5"
								/>
							</div>

							<Separator />

							<div>
								<Label className="mb-3 block text-base font-medium">
									Contraintes par filière
								</Label>
								<p className="mb-4 text-sm text-muted-foreground">
									Indiquez combien d&apos;étudiants de chaque
									filière doivent figurer dans chaque équipe.
									Laissez 0 pour ne pas imposer de contrainte.
								</p>
								<motion.div
									className="space-y-3"
									variants={cardStagger}
									initial="initial"
									animate="animate"
								>
									{constraints.map((c, i) => (
										<motion.div
											key={c.filiere}
											variants={constraintRow}
											transition={{ delay: i * 0.06 }}
											whileHover={{
												backgroundColor:
													"var(--muted)",
												transition: {
													duration: 0.2,
												},
											}}
											className="flex items-center gap-4 rounded-lg border p-3"
										>
											<span className="min-w-[140px] text-sm font-medium">
												{c.filiere}
											</span>
											<Badge
												variant="outline"
												className="shrink-0"
											>
												{filiereCounts[c.filiere]}{" "}
												dispo.
											</Badge>
											<Input
												type="number"
												min={0}
												max={
													filiereCounts[c.filiere]
												}
												value={c.count}
												onChange={(e) =>
													onConstraintChange(
														c.filiere,
														Number(
															e.target.value
														)
													)
												}
												className="w-20"
											/>
											<span className="text-sm text-muted-foreground">
												par équipe
											</span>
										</motion.div>
									))}
								</motion.div>
							</div>

							{/* Summary */}
							<motion.div
								className="rounded-lg bg-muted p-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								<p className="text-sm">
									<strong>Résumé :</strong> Équipes de{" "}
									{teamSize} personnes
									{constraints.some(
										(c) => c.count > 0
									) && (
										<>
											{" "}
											avec{" "}
											{constraints
												.filter((c) => c.count > 0)
												.map(
													(c) =>
														`${c.count} ${c.filiere}`
												)
												.join(", ")}
										</>
									)}
									{" "}&mdash;{" "}
									{remainingSlots > 0
										? `${remainingSlots} place(s) libre(s) par équipe`
										: remainingSlots === 0
											? "toutes les places sont contraintes"
											: "ATTENTION : trop de contraintes !"}
								</p>
							</motion.div>

							{/* Actions */}
							<div className="flex gap-3 pt-2">
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.97 }}
								>
									<Button
										variant="outline"
										onClick={onReset}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Recommencer
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.97 }}
								>
									<Button onClick={() => setConfirmOpen(true)}>
										<Users className="mr-2 h-4 w-4" />
										Générer les équipes
									</Button>
								</motion.div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>

			<ConfirmGenerateDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				studentCount={studentCount}
				teamSize={teamSize}
				constraints={constraints}
				onConfirm={onGenerate}
			/>
		</motion.div>
	);
}
