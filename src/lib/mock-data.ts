import { Patient, Consultation, RendezVous, User } from './types';

export const mockUsers: User[] = [
  { id: '1', email: 'dr.martin@clinique.fr', nom: 'Martin', prenom: 'Jean', role: 'medecin', telephone: '06 55 44 33 22', specialite: 'Médecine générale', numeroOrdre: '75-12345', adresse: '10 Rue Pasteur', ville: 'Paris', codePostal: '75006' },
  { id: '2', email: 'admin@clinique.fr', nom: 'Dupont', prenom: 'Marie', role: 'admin_staff', telephone: '06 11 22 33 44' },
];

export const mockPatients: Patient[] = [
  {
    id: 'P001', nom: 'Lefebvre', prenom: 'Sophie', dateNaissance: '1985-03-15', sexe: 'F',
    telephone: '06 12 34 56 78', email: 'sophie.lefebvre@email.fr',
    adresse: '12 Rue de la Paix', ville: 'Paris', codePostal: '75001',
    groupeSanguin: 'A+', allergies: 'Pénicilline', antecedents: 'Asthme',
    createdAt: '2024-01-15',
  },
  {
    id: 'P002', nom: 'Bernard', prenom: 'Pierre', dateNaissance: '1972-08-22', sexe: 'M',
    telephone: '06 98 76 54 32', email: 'pierre.bernard@email.fr',
    adresse: '45 Avenue Victor Hugo', ville: 'Lyon', codePostal: '69001',
    groupeSanguin: 'O-', allergies: '', antecedents: 'Hypertension',
    createdAt: '2024-02-10',
  },
  {
    id: 'P003', nom: 'Moreau', prenom: 'Claire', dateNaissance: '1990-11-05', sexe: 'F',
    telephone: '07 11 22 33 44', email: 'claire.moreau@email.fr',
    adresse: '8 Boulevard Haussmann', ville: 'Marseille', codePostal: '13001',
    createdAt: '2024-03-01',
  },
];

export const mockConsultations: Consultation[] = [
  {
    id: 'C001', patientId: 'P001', medecinId: '1', date: '2024-12-01',
    motif: 'Douleurs abdominales', symptomes: 'Douleur épigastrique, nausées',
    observations: 'Abdomen souple, douleur à la palpation épigastrique',
    diagnostic: 'Gastrite aiguë',
    prescriptions: [
      { id: 'RX001', medicament: 'Oméprazole', dosage: '20mg', frequence: '1x/jour', duree: '14 jours', instructions: 'Avant le petit-déjeuner' },
    ],
    statut: 'terminee',
  },
  {
    id: 'C002', patientId: 'P002', medecinId: '1', date: '2024-12-10',
    motif: 'Contrôle tension', symptomes: 'Céphalées occasionnelles',
    observations: 'TA: 150/95 mmHg, pouls 78/min',
    diagnostic: 'Hypertension artérielle non contrôlée',
    prescriptions: [
      { id: 'RX002', medicament: 'Amlodipine', dosage: '10mg', frequence: '1x/jour', duree: '30 jours', instructions: 'Le matin' },
      { id: 'RX003', medicament: 'Ramipril', dosage: '5mg', frequence: '1x/jour', duree: '30 jours', instructions: 'Le soir' },
    ],
    statut: 'terminee',
  },
];

export const mockRendezVous: RendezVous[] = [
  { id: 'RDV001', patientId: 'P001', medecinId: '1', date: '2025-01-15', heure: '09:00', motif: 'Suivi gastrite', statut: 'planifie' },
  { id: 'RDV002', patientId: 'P003', medecinId: '1', date: '2025-01-15', heure: '10:30', motif: 'Consultation initiale', statut: 'confirme' },
  { id: 'RDV003', patientId: 'P002', medecinId: '1', date: '2025-01-16', heure: '14:00', motif: 'Contrôle tension', statut: 'planifie' },
];
