export interface Student {
	nom: string;
	prenom: string;
	filiere: string;
}

export interface FiliereConstraint {
	filiere: string;
	count: number;
}

export interface Team {
	id: number;
	members: Student[];
}

export interface TeamConfig {
	teamSize: number;
	constraints: FiliereConstraint[];
}

/**
 * Parse les données Excel brutes en liste d'étudiants.
 * Supporte les noms de colonnes flexibles (Nom/nom/NOM, Prénom/prenom, Filière/filiere, etc.)
 */
export function parseStudents(
	data: Record<string, unknown>[]
): Student[] {
	return data
		.map((row) => {
			const nom = findValue(row, ["nom", "name", "last_name", "lastname"]);
			const prenom = findValue(row, [
				"prenom",
				"prénom",
				"firstname",
				"first_name",
				"prénom",
			]);
			const filiere = findValue(row, [
				"filiere",
				"filière",
				"filiere",
				"department",
				"section",
				"specialite",
				"spécialité",
			]);

			if (!nom || !filiere) return null;

			return {
				nom: nom.trim(),
				prenom: prenom?.trim() ?? "",
				filiere: filiere.trim(),
			};
		})
		.filter((s): s is Student => s !== null);
}

function findValue(
	row: Record<string, unknown>,
	possibleKeys: string[]
): string | undefined {
	for (const key of Object.keys(row)) {
		const normalized = key
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim();
		for (const possible of possibleKeys) {
			const normalizedPossible = possible
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.trim();
			if (normalized === normalizedPossible) {
				const val = row[key];
				return val != null ? String(val) : undefined;
			}
		}
	}
	return undefined;
}

/**
 * Extrait les filières uniques à partir de la liste d'étudiants.
 */
export function extractFilieres(students: Student[]): string[] {
	return [...new Set(students.map((s) => s.filiere))].sort();
}

/**
 * Compte le nombre d'étudiants par filière.
 */
export function countByFiliere(
	students: Student[]
): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const s of students) {
		counts[s.filiere] = (counts[s.filiere] || 0) + 1;
	}
	return counts;
}

/**
 * Répartit les étudiants en équipes selon les contraintes de filière.
 *
 * Principes :
 * - Le nombre d'équipes est basé sur total étudiants / taille d'équipe
 *   (on crée assez d'équipes pour placer TOUT LE MONDE)
 * - Les contraintes sont des minimums souhaités : "au moins N de telle filière par équipe"
 * - Si une filière n'a pas assez d'étudiants pour satisfaire la contrainte dans toutes
 *   les équipes, on distribue ce qu'on a en round-robin (équitablement)
 * - Les places restantes sont remplies avec les étudiants non encore assignés
 * - Les seuls "non assignés" sont le reste de la division euclidienne
 *   (< teamSize étudiants), et ils sont quand même ajoutés aux équipes existantes
 *
 * Algorithme :
 * 1. Calculer nbEquipes = ceil(totalEtudiants / teamSize)
 * 2. Pour chaque filière contrainte, distribuer en round-robin :
 *    - Remplir chaque équipe avec min(count, restant dans le pool) étudiants
 *    - Si le pool s'épuise avant d'avoir rempli toutes les équipes, on s'arrête
 * 3. Collecter tous les étudiants restants (filières non contraintes + excédents)
 * 4. Remplir les places libres de chaque équipe avec les restants
 * 5. S'il reste encore des étudiants, les distribuer un par un dans les équipes
 *    (round-robin), même si ça dépasse teamSize de 1 max
 */
export function makeTeams(
	students: Student[],
	config: TeamConfig
): { teams: Team[]; unassigned: Student[] } {
	const { teamSize, constraints } = config;

	if (students.length === 0) {
		return { teams: [], unassigned: [] };
	}

	// Calculer le nombre total de personnes par équipe selon les contraintes
	const totalConstrained = constraints.reduce((sum, c) => sum + c.count, 0);

	if (totalConstrained > teamSize) {
		throw new Error(
			`La somme des contraintes (${totalConstrained}) dépasse la taille d'équipe (${teamSize}).`
		);
	}

	// Nombre d'équipes : on veut placer tout le monde
	const nbTeams = Math.ceil(students.length / teamSize);

	// Grouper les étudiants par filière et mélanger
	const byFiliere: Record<string, Student[]> = {};
	for (const s of students) {
		if (!byFiliere[s.filiere]) byFiliere[s.filiere] = [];
		byFiliere[s.filiere].push(s);
	}
	for (const key of Object.keys(byFiliere)) {
		shuffle(byFiliere[key]);
	}

	// Créer les équipes vides
	const teams: Team[] = Array.from({ length: nbTeams }, (_, i) => ({
		id: i + 1,
		members: [],
	}));

	const assigned = new Set<Student>();

	// Phase 1 : Remplir selon les contraintes (round-robin)
	// Pour chaque filière contrainte, on distribue équitablement
	for (const c of constraints) {
		if (c.count <= 0) continue;
		const pool = byFiliere[c.filiere];
		if (!pool || pool.length === 0) continue;

		for (const team of teams) {
			let added = 0;
			while (added < c.count && pool.length > 0) {
				const student = pool.pop()!;
				team.members.push(student);
				assigned.add(student);
				added++;
			}
			// Si le pool est épuisé, on continue vers les équipes suivantes
			// mais elles n'auront pas cette filière — c'est normal si la filière
			// n'a pas assez d'étudiants
		}
	}

	// Phase 2 : Collecter tous les étudiants restants
	const remaining = students.filter((s) => !assigned.has(s));
	shuffle(remaining);

	// Phase 3 : Remplir les équipes jusqu'à teamSize avec les restants
	let idx = 0;
	for (const team of teams) {
		while (team.members.length < teamSize && idx < remaining.length) {
			team.members.push(remaining[idx]);
			assigned.add(remaining[idx]);
			idx++;
		}
	}

	// Phase 4 : S'il reste encore des étudiants (reste de la division),
	// les distribuer un par un dans les équipes existantes (round-robin)
	// Cela fait que certaines équipes auront teamSize+1, mais personne n'est exclu
	let teamIdx = 0;
	while (idx < remaining.length) {
		teams[teamIdx % nbTeams].members.push(remaining[idx]);
		assigned.add(remaining[idx]);
		idx++;
		teamIdx++;
	}

	return { teams, unassigned: [] };
}

function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
