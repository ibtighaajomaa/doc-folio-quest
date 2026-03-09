import { useState } from 'react';
import { mockRendezVous, mockPatients, mockUsers } from '@/lib/mock-data';
import { RendezVous } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import RendezVousFormDialog from '@/components/RendezVousFormDialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const statutColors: Record<string, string> = {
  planifie: 'bg-warning/10 text-warning',
  confirme: 'bg-success/10 text-success',
  annule: 'bg-destructive/10 text-destructive',
  termine: 'bg-muted text-muted-foreground',
};

const statutLabels: Record<string, string> = {
  planifie: 'Planifié',
  confirme: 'Confirmé',
  annule: 'Annulé',
  termine: 'Terminé',
};

const RendezVousPage = () => {
  const [rdvs, setRdvs] = useState<RendezVous[]>(mockRendezVous);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRdv, setEditingRdv] = useState<RendezVous | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (data: Omit<RendezVous, 'id'>) => {
    if (editingRdv) {
      setRdvs(prev => prev.map(r => r.id === editingRdv.id ? { ...r, ...data } : r));
    } else {
      setRdvs(prev => [...prev, { id: `RDV${Date.now()}`, ...data }]);
    }
    setEditingRdv(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setRdvs(prev => prev.filter(r => r.id !== deleteId));
    toast({ title: 'Rendez-vous supprimé', description: 'Le rendez-vous a été supprimé.' });
    setDeleteId(null);
  };

  const openEdit = (rdv: RendezVous) => {
    setEditingRdv(rdv);
    setFormOpen(true);
  };

  const openNew = () => {
    setEditingRdv(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Rendez-vous</h1>
          <p className="text-muted-foreground text-sm">{rdvs.length} rendez-vous</p>
        </div>
        <Button onClick={openNew} className="medical-gradient border-0 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Nouveau RDV
        </Button>
      </div>

      {rdvs.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Aucun rendez-vous planifié.</p>
      )}

      <div className="space-y-3">
        {rdvs.map(rdv => {
          const patient = mockPatients.find(p => p.id === rdv.patientId);
          const medecin = mockUsers.find(u => u.id === rdv.medecinId);
          return (
            <Card key={rdv.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-heading font-bold text-primary">{rdv.heure}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />{rdv.date}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{patient?.prenom} {patient?.nom}</p>
                    <p className="text-xs text-muted-foreground">{rdv.motif}</p>
                    {medecin && (
                      <p className="text-xs text-muted-foreground">Dr. {medecin.prenom} {medecin.nom}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statutColors[rdv.statut]} border-0`}>
                    {statutLabels[rdv.statut]}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(rdv)} title="Modifier">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(rdv.id)} title="Supprimer"
                    className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RendezVousFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rdv={editingRdv}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce rendez-vous ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le rendez-vous sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RendezVousPage;
