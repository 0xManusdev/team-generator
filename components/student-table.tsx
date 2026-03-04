"use client";

import { motion } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { tableRow } from "@/lib/animations";
import type { Student } from "@/lib/team-maker";

interface StudentTableProps {
	students: Student[];
	/** Delay offset for stagger animation (in seconds) */
	animationOffset?: number;
}

export function StudentTable({ students, animationOffset = 0 }: StudentTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12">#</TableHead>
					<TableHead>Nom</TableHead>
					<TableHead>Prénom</TableHead>
					<TableHead>Filière</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{students.map((m, i) => (
					<motion.tr
						key={`${m.nom}-${m.prenom}-${i}`}
						variants={tableRow}
						initial="initial"
						animate="animate"
						transition={{
							delay: animationOffset + i * 0.03,
						}}
						className="border-b transition-colors hover:bg-muted/50"
					>
						<TableCell className="font-medium">{i + 1}</TableCell>
						<TableCell>{m.nom}</TableCell>
						<TableCell>{m.prenom}</TableCell>
						<TableCell>
							<Badge variant="outline">{m.filiere}</Badge>
						</TableCell>
					</motion.tr>
				))}
			</TableBody>
		</Table>
	);
}
