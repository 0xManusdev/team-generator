"use client";

import { motion, AnimatePresence } from "motion/react";
import { Download, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamCard } from "@/components/team-card";
import { StudentTable } from "@/components/student-table";
import {
	pageTransition,
	cardStagger,
	cardItem,
	EASE_OUT_QUART,
} from "@/lib/animations";
import type { Team, Student } from "@/lib/team-maker";

interface ResultsStepProps {
	teams: Team[];
	unassigned: Student[];
	totalStudents: number;
	onDownloadPDF: () => void;
	onReconfigure: () => void;
	onReset: () => void;
}

export function ResultsStep({
	teams,
	unassigned,
	totalStudents,
	onDownloadPDF,
	onReconfigure,
	onReset,
}: ResultsStepProps) {
	return (
		<motion.div
			key="results"
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
				{/* Header */}
				<motion.div variants={cardItem}>
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>
										{teams.length} équipes générées
									</CardTitle>
									<CardDescription>
										{totalStudents - unassigned.length}{" "}
										étudiants assignés
										{unassigned.length > 0 &&
											` — ${unassigned.length} non assigné(s)`}
									</CardDescription>
								</div>
								<div className="flex gap-2">
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.97 }}
									>
										<Button
											variant="outline"
											onClick={onReconfigure}
										>
											<RefreshCw className="mr-2 h-4 w-4" />
											Reconfigurer
										</Button>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.97 }}
									>
										<Button onClick={onDownloadPDF}>
											<Download className="mr-2 h-4 w-4" />
											Télécharger PDF
										</Button>
									</motion.div>
								</div>
							</div>
						</CardHeader>
					</Card>
				</motion.div>

				{/* Team cards */}
				{teams.map((team, i) => (
					<TeamCard key={team.id} team={team} index={i} />
				))}

				{/* Unassigned */}
				<AnimatePresence>
					{unassigned.length > 0 && (
						<motion.div
							variants={cardItem}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<Card className="border-destructive/50">
								<CardHeader className="pb-3">
									<CardTitle className="text-base text-destructive">
										Étudiants non assignés
										<Badge
											variant="destructive"
											className="ml-2"
										>
											{unassigned.length}
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<StudentTable students={unassigned} />
								</CardContent>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Bottom actions */}
				<motion.div
					className="flex justify-center gap-3 pb-8"
					variants={cardItem}
				>
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
					>
						<Button variant="outline" onClick={onReset}>
							<Trash2 className="mr-2 h-4 w-4" />
							Nouveau fichier
						</Button>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
					>
						<Button onClick={onDownloadPDF}>
							<Download className="mr-2 h-4 w-4" />
							Télécharger PDF
						</Button>
					</motion.div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
