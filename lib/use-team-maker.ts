"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
	type Student,
	type FiliereConstraint,
	type Team,
	parseStudents,
	extractFilieres,
	countByFiliere,
	makeTeams,
} from "@/lib/team-maker";
import { generateTeamsPDF } from "@/lib/pdf-generator";

export type Step = "upload" | "configure" | "results";
export const STEPS: Step[] = ["upload", "configure", "results"];

export function useTeamMaker() {
	const [step, setStep] = useState<Step>("upload");
	const [students, setStudents] = useState<Student[]>([]);
	const [filieres, setFilieres] = useState<string[]>([]);
	const [filiereCounts, setFiliereCounts] = useState<Record<string, number>>(
		{}
	);
	const [fileName, setFileName] = useState("");
	const [teamSize, setTeamSize] = useState(4);
	const [constraints, setConstraints] = useState<FiliereConstraint[]>([]);
	const [teams, setTeams] = useState<Team[]>([]);
	const [unassigned, setUnassigned] = useState<Student[]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleFile = useCallback((file: File) => {
		setError(null);
		setFileName(file.name);

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Record<
					string,
					unknown
				>[];

				const parsed = parseStudents(jsonData);

				if (parsed.length === 0) {
					setError(
						"Aucun étudiant trouvé. Vérifiez que votre fichier contient des colonnes Nom, Prénom et Filière."
					);
					return;
				}

				setStudents(parsed);
				const filiereList = extractFilieres(parsed);
				setFilieres(filiereList);
				setFiliereCounts(countByFiliere(parsed));
				setConstraints(
					filiereList.map((f) => ({ filiere: f, count: 0 }))
				);
				setStep("configure");
			} catch {
				setError(
					"Erreur lors de la lecture du fichier. Vérifiez le format."
				);
			}
		};
		reader.readAsArrayBuffer(file);
	}, []);

	const updateConstraint = useCallback(
		(filiere: string, count: number) => {
			setConstraints((prev) =>
				prev.map((c) =>
					c.filiere === filiere ? { ...c, count } : c
				)
			);
		},
		[]
	);

	const handleGenerate = useCallback(() => {
		setError(null);
		try {
			const activeConstraints = constraints.filter((c) => c.count > 0);
			const result = makeTeams(students, {
				teamSize,
				constraints: activeConstraints,
			});
			setTeams(result.teams);
			setUnassigned(result.unassigned);
			setStep("results");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Erreur lors de la génération."
			);
		}
	}, [constraints, students, teamSize]);

	const handleDownloadPDF = useCallback(() => {
		const doc = generateTeamsPDF(teams, unassigned);
		doc.save("repartition-equipes.pdf");
	}, [teams, unassigned]);

	const handleReset = useCallback(() => {
		setStep("upload");
		setStudents([]);
		setFilieres([]);
		setFiliereCounts({});
		setFileName("");
		setTeamSize(4);
		setConstraints([]);
		setTeams([]);
		setUnassigned([]);
		setError(null);
	}, []);

	const handleReconfigure = useCallback(() => {
		setStep("configure");
		setTeams([]);
		setUnassigned([]);
	}, []);

	return {
		// State
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
		// Actions
		setTeamSize,
		handleFile,
		updateConstraint,
		handleGenerate,
		handleDownloadPDF,
		handleReset,
		handleReconfigure,
	};
}
