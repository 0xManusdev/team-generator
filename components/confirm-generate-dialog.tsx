"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { FiliereConstraint } from "@/lib/team-maker";

interface ConfirmGenerateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	studentCount: number;
	teamSize: number;
	constraints: FiliereConstraint[];
	onConfirm: () => void;
}

export function ConfirmGenerateDialog({
	open,
	onOpenChange,
	studentCount,
	teamSize,
	constraints,
	onConfirm,
}: ConfirmGenerateDialogProps) {
	const nbTeams = Math.ceil(studentCount / teamSize);
	const remainder = studentCount % teamSize;
	const activeConstraints = constraints.filter((c) => c.count > 0);

	function handleConfirm() {
		onOpenChange(false);
		onConfirm();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Confirmer la génération
					</DialogTitle>
					<DialogDescription>
						Vérifiez le récapitulatif avant de générer les équipes.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div className="rounded-lg border p-3">
							<p className="text-muted-foreground">Étudiants</p>
							<p className="text-lg font-semibold">
								{studentCount}
							</p>
						</div>
						<div className="rounded-lg border p-3">
							<p className="text-muted-foreground">Équipes</p>
							<p className="text-lg font-semibold">{nbTeams}</p>
						</div>
						<div className="rounded-lg border p-3">
							<p className="text-muted-foreground">
								Taille d&apos;équipe
							</p>
							<p className="text-lg font-semibold">{teamSize}</p>
						</div>
						<div className="rounded-lg border p-3">
							<p className="text-muted-foreground">Reste</p>
							<p className="text-lg font-semibold">
								{remainder === 0
									? "Aucun"
									: `${remainder} étudiant${remainder > 1 ? "s" : ""}`}
							</p>
						</div>
					</div>

					{remainder > 0 && (
						<p className="text-xs text-muted-foreground">
							{remainder} étudiant{remainder > 1 ? "s" : ""}{" "}
							seront répartis dans les équipes existantes (certaines auront {teamSize + 1} membres).
						</p>
					)}

					{activeConstraints.length > 0 && (
						<div>
							<p className="mb-2 text-sm font-medium">
								Contraintes actives
							</p>
							<div className="flex flex-wrap gap-2">
								{activeConstraints.map((c) => (
									<Badge
										key={c.filiere}
										variant="secondary"
									>
										{c.count} {c.filiere} par équipe
									</Badge>
								))}
							</div>
						</div>
					)}

					{activeConstraints.length === 0 && (
						<p className="text-sm text-muted-foreground">
							Aucune contrainte de filière &mdash; les étudiants
							seront répartis aléatoirement.
						</p>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Annuler
					</Button>
					<Button onClick={handleConfirm}>
						<Users className="mr-2 h-4 w-4" />
						Générer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
