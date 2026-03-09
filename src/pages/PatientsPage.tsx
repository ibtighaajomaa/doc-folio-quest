import { useState } from 'react';
import { mockPatients } from '@/lib/mock-data';
import { Patient } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, Phone, Mail, Pencil, Trash2 } from 'lucide-react';
import PatientFormDialog from '@/components/PatientFormDialog';
import PatientDetailDialog from '@/components/PatientDetailDialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p =>
    `${p.nom} ${p.prenom} ${p.id}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSavePatient = (patient: Patient) => {
    if (editingPatient) {
      setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
    } else {
      setPatients(prev => [...prev, patient]);
    }
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleEdit = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    setDeletingPatient(patient);
  };

  const confirmDelete = () => {
    if (deletingPatient) {
      setPatients(prev => prev.filter(p => p.id !== deletingPatient.id));
      toast.success(`Patient ${deletingPatient.prenom} ${deletingPatient.nom} supprimé`);
      setDeletingPatient(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Patients</h1>
          <p className="text-muted-foreground text-sm">{patients.length} patients enregistrés</p>
        </div>
        <Button className="medical-gradient border-0 text-primary-foreground" onClick={() => { setEditingPatient(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau patient
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher par nom, prénom ou ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(patient => (
          <Card key={patient.id} className="glass-card hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedPatient(patient)}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{patient.prenom} {patient.nom}</p>
                    <Badge variant="outline" className="text-xs shrink-0">{patient.id}</Badge>
                    <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleEdit(e, patient)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => handleDeleteClick(e, patient)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {patient.sexe === 'M' ? 'Homme' : 'Femme'} · Né(e) le {patient.dateNaissance}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{patient.telephone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{patient.email}</span>
                  </div>
                  {patient.allergies && (
                    <Badge variant="destructive" className="mt-2 text-xs">Allergie: {patient.allergies}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PatientFormDialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingPatient(null); }} onSubmit={handleSavePatient} editingPatient={editingPatient} />
      <PatientDetailDialog patient={selectedPatient} onClose={() => setSelectedPatient(null)} />

      <AlertDialog open={!!deletingPatient} onOpenChange={(o) => { if (!o) setDeletingPatient(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le patient</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deletingPatient?.prenom} {deletingPatient?.nom}</strong> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientsPage;