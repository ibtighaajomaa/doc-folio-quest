export type UserRole = 'medecin' | 'admin_staff';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone?: string;
  specialite?: string;
  numeroOrdre?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  codePostal: string;
  groupeSanguin?: string;
  allergies?: string;
  antecedents?: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  motif: string;
  symptomes: string;
  observations: string;
  diagnostic: string;
  prescriptions: Prescription[];
  statut: 'en_cours' | 'terminee';
}

export interface Prescription {
  id: string;
  medicament: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions?: string;
}

export interface RendezVous {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  heure: string;
  motif: string;
  statut: 'planifie' | 'confirme' | 'annule' | 'termine';
}
