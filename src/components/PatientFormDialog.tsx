import React, { useState } from 'react';
import { Patient } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (patient: Patient) => void;
  editingPatient?: Patient | null;
}

const FieldHelp = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
    </TooltipTrigger>
    <TooltipContent className="max-w-[200px] text-xs">{text}</TooltipContent>
  </Tooltip>
);

const PatientFormDialog = ({ open, onOpenChange, onSubmit, editingPatient }: Props) => {
  const emptyForm = {
    nom: '', prenom: '', dateNaissance: '', sexe: '' as 'M' | 'F',
    telephone: '', email: '', adresse: '', ville: '', codePostal: '',
    groupeSanguin: '', allergies: '', antecedents: '',
  };

  const [form, setForm] = useState(emptyForm);

  React.useEffect(() => {
    if (editingPatient) {
      setForm({
        nom: editingPatient.nom, prenom: editingPatient.prenom,
        dateNaissance: editingPatient.dateNaissance, sexe: editingPatient.sexe,
        telephone: editingPatient.telephone, email: editingPatient.email,
        adresse: editingPatient.adresse, ville: editingPatient.ville,
        codePostal: editingPatient.codePostal,
        groupeSanguin: editingPatient.groupeSanguin || '',
        allergies: editingPatient.allergies || '',
        antecedents: editingPatient.antecedents || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingPatient, open]);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      ...form,
      id: editingPatient?.id || `P${String(Date.now()).slice(-4)}`,
      createdAt: editingPatient?.createdAt || new Date().toISOString().split('T')[0],
    };
    onSubmit(patient);
    setForm(emptyForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <UserPlus className="h-5 w-5 text-primary" />
            {editingPatient ? 'Modifier le patient' : 'Enregistrer un nouveau patient'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identité */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Identité</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Nom <FieldHelp text="Nom de famille du patient" /></Label>
                <Input placeholder="Ex: Dupont" value={form.nom} onChange={e => update('nom', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Prénom <FieldHelp text="Prénom usuel du patient" /></Label>
                <Input placeholder="Ex: Marie" value={form.prenom} onChange={e => update('prenom', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Date de naissance <FieldHelp text="Format: JJ/MM/AAAA" /></Label>
                <Input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Sexe <FieldHelp text="Sexe biologique du patient" /></Label>
                <Select value={form.sexe} onValueChange={v => update('sexe', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Coordonnées</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Téléphone <FieldHelp text="Numéro de téléphone principal" /></Label>
                <Input placeholder="06 12 34 56 78" value={form.telephone} onChange={e => update('telephone', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Email <FieldHelp text="Adresse e-mail du patient" /></Label>
                <Input type="email" placeholder="patient@email.fr" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Adresse</Label>
                <Input placeholder="12 Rue de la Paix" value={form.adresse} onChange={e => update('adresse', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Ville</Label>
                <Input placeholder="Paris" value={form.ville} onChange={e => update('ville', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Code postal</Label>
                <Input placeholder="75001" value={form.codePostal} onChange={e => update('codePostal', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Médical */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Informations médicales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Groupe sanguin <FieldHelp text="Ex: A+, O-, AB+" /></Label>
                <Select value={form.groupeSanguin} onValueChange={v => update('groupeSanguin', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">Allergies <FieldHelp text="Allergies connues (médicaments, aliments...)" /></Label>
                <Input placeholder="Ex: Pénicilline, Arachides" value={form.allergies} onChange={e => update('allergies', e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="flex items-center gap-1.5">Antécédents médicaux <FieldHelp text="Pathologies, chirurgies, hospitalisations passées" /></Label>
                <Textarea placeholder="Décrivez les antécédents médicaux importants..." value={form.antecedents} onChange={e => update('antecedents', e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="medical-gradient border-0 text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> {editingPatient ? 'Modifier' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormDialog;
