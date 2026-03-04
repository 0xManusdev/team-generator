import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { INTER_REGULAR } from "./fonts/inter_regular";
import { INTER_BOLD } from "./fonts/inter_bold";
import type { Team, Student } from "./team-maker";

function registerInterFont(doc: jsPDF) {
	doc.addFileToVFS("Inter-Regular.ttf", INTER_REGULAR);
	doc.addFont("Inter-Regular.ttf", "Inter", "normal");

	doc.addFileToVFS("Inter-Bold.ttf", INTER_BOLD);
	doc.addFont("Inter-Bold.ttf", "Inter", "bold");
}

export function generateTeamsPDF(
	teams: Team[],
	unassigned: Student[],
	title: string = "Répartition des Équipes"
): jsPDF {
	const doc = new jsPDF();
	registerInterFont(doc);

	// Titre
	doc.setFontSize(20);
	doc.setFont("Inter", "bold");
	doc.text(title, 105, 20, { align: "center" });

	doc.setFontSize(10);
	doc.setFont("Inter", "normal");
	doc.text(
		`Généré le ${new Date().toLocaleDateString("fr-FR")} - ${teams.length} équipes`,
		105,
		28,
		{ align: "center" }
	);

	let yOffset = 35;

	for (const team of teams) {
		// Vérifier s'il reste assez de place sur la page
		const estimatedHeight = 15 + team.members.length * 8;
		if (yOffset + estimatedHeight > 270) {
			doc.addPage();
			yOffset = 20;
		}

		// Titre de l'équipe
		doc.setFontSize(13);
		doc.setFont("Inter", "bold");
		doc.text(`Équipe ${team.id}`, 14, yOffset);
		yOffset += 3;

		// Tableau des membres
		const tableData = team.members.map((m, idx) => [
			String(idx + 1),
			m.nom,
			m.prenom,
			m.filiere,
		]);

		autoTable(doc, {
			startY: yOffset,
			head: [["#", "Nom", "Prénom", "Filière"]],
			body: tableData,
			theme: "grid",
			styles: {
				font: "Inter",
			},
			headStyles: {
				fillColor: [41, 37, 36],
				textColor: [255, 255, 255],
				fontStyle: "bold",
				fontSize: 9,
			},
			bodyStyles: {
				fontSize: 9,
			},
			alternateRowStyles: {
				fillColor: [245, 245, 244],
			},
			columnStyles: {
				0: { cellWidth: 12, halign: "center" },
				1: { cellWidth: 50 },
				2: { cellWidth: 50 },
				3: { cellWidth: 50 },
			},
			margin: { left: 14, right: 14 },
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		yOffset = (doc as any).lastAutoTable.finalY + 10;
	}

	// Section des non-assignés
	if (unassigned.length > 0) {
		if (yOffset + 30 > 270) {
			doc.addPage();
			yOffset = 20;
		}

		doc.setFontSize(13);
		doc.setFont("Inter", "bold");
		doc.setTextColor(180, 0, 0);
		doc.text("Étudiants non assignés", 14, yOffset);
		doc.setTextColor(0, 0, 0);
		yOffset += 3;

		const unassignedData = unassigned.map((m, idx) => [
			String(idx + 1),
			m.nom,
			m.prenom,
			m.filiere,
		]);

		autoTable(doc, {
			startY: yOffset,
			head: [["#", "Nom", "Prénom", "Filière"]],
			body: unassignedData,
			theme: "grid",
			styles: {
				font: "Inter",
			},
			headStyles: {
				fillColor: [180, 0, 0],
				textColor: [255, 255, 255],
				fontStyle: "bold",
				fontSize: 9,
			},
			bodyStyles: { fontSize: 9 },
			columnStyles: {
				0: { cellWidth: 12, halign: "center" },
				1: { cellWidth: 50 },
				2: { cellWidth: 50 },
				3: { cellWidth: 50 },
			},
			margin: { left: 14, right: 14 },
		});
	}

	return doc;
}
