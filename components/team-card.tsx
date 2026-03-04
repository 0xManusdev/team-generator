"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentTable } from "@/components/student-table";
import { cardItem } from "@/lib/animations";
import type { Team } from "@/lib/team-maker";

interface TeamCardProps {
	team: Team;
	index: number;
}

export function TeamCard({ team, index }: TeamCardProps) {
	return (
		<motion.div
			variants={cardItem}
			transition={{ delay: index * 0.06 }}
		>
			<Card className="overflow-hidden">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">
						Équipe {team.id}
						<Badge variant="secondary" className="ml-2">
							{team.members.length} membres
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<StudentTable
						students={team.members}
						animationOffset={index * 0.06}
					/>
				</CardContent>
			</Card>
		</motion.div>
	);
}
