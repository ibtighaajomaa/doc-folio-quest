import { useState, useEffect } from 'react';
import { RendezVous } from '@/lib/types';
import { mockPatients, mockUsers } from '@/lib/mock-data';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const MOTIFS = [
  'Consultation initiale',
  'Suivi',
  'Contrôle',
  'Urgence',
  'Bilan annuel',
  'Autre',
];

const HEURES = Array.from({ length: 20 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rdv?: RendezVous | null;
  onSave: (data: Omit<RendezVous, 'id'>) => void;
}

interface FormErrors {
  patientId?: string;
  medecinId?: string;
  date?: string;
  heure?: string;
  motif?: string;
}

const RendezVousFormDialog = ({ open, onOpenChange, rdv, onSave }: Props) => {
  const medecins = mockUsers.filter(u => u.role === 'medecin');

  const [patientId, setPatientId] = useState('');
  const [medecinId, setMedecinId] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [heure, setHeure] = useState('');
  const [motif, setMotif] = useState('');
  const [motifAutre, setMotifAutre] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      if (rdv) {
        setPatientId(rdv.patientId);
        setMedecinId(rdv.medecinId);
        setDate(parse(rdv.date, 'yyyy-MM-dd', new Date()));
        setHeure(rdv.heure);
        const isPreset = MOTIFS.includes(rdv.motif);
        setMotif(isPreset ? rdv.motif : 'Autre');
        setMotifAutre(isPreset ? '' : rdv.motif);
      } else {
        setPatientId('');
        setMedecinId(medecins[0]?.id || '');
        setDate(undefined);
        setHeure('');
        setMotif('');
        setMotifAutre('');
      }
      setErrors({});
    }
  }, [open, rdv]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!patientId) e.patientId = 'Veuillez sélectionner un patient.';
    if (!medecinId) e.medecinId = 'Veuillez sélectionner un médecin.';
    if (!date) e.date = 'Veuillez choisir une date.';
    else if (date < new Date(new Date().toDateString())) e.date = 'La date ne peut pas être dans le passé.';
    if (!heure) e.heure = 'Veuillez choisir une heure.';
    const finalMotif = motif === 'Autre' ? motifAutre.trim() : motif;
    if (!finalMotif) e.motif = 'Veuillez indiquer un motif.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const finalMotif = motif === 'Autre' ? motifAutre.trim() : motif;
    onSave({
      patientId,
      medecinId,
      date: format(date!, 'yyyy-MM-dd'),
      heure,
      motif: finalMotif,
      statut: rdv?.statut || 'planifie',
    });
    toast({
      title: rdv ? 'Rendez-vous modifié' : 'Rendez-vous créé',
      description: `Le rendez-vous a été ${rdv ? 'modifié' : 'planifié'} avec succès.`,
    });
    onOpenChange(false);
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-sm text-destructive">{msg}</p> : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rdv ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}</DialogTitle>
          <DialogDescription>
            {rdv ? 'Modifiez les informations du rendez-vous.' : 'Planifiez un nouveau rendez-vous pour un patient.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Patient */}
          <div className="space-y-1.5">
            <Label>Patient *</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un patient" /></SelectTrigger>
              <SelectContent>
                {mockPatients.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError msg={errors.patientId} />
          </div>

          {/* Médecin */}
          <div className="space-y-1.5">
            <Label>Médecin *</Label>
            <Select value={medecinId} onValueChange={setMedecinId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un médecin" /></SelectTrigger>
              <SelectContent>
                {medecins.map(m => (
                  <SelectItem key={m.id} value={m.id}>Dr. {m.prenom} {m.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError msg={errors.medecinId} />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : 'Choisir une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={d => d < new Date(new Date().toDateString())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FieldError msg={errors.date} />
          </div>

          {/* Heure */}
          <div className="space-y-1.5">
            <Label>Heure *</Label>
            <Select value={heure} onValueChange={setHeure}>
              <SelectTrigger><SelectValue placeholder="Choisir une heure" /></SelectTrigger>
              <SelectContent>
                {HEURES.map(h => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError msg={errors.heure} />
          </div>

          {/* Motif */}
          <div className="space-y-1.5">
            <Label>Type de rendez-vous *</Label>
            <Select value={motif} onValueChange={setMotif}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un motif" /></SelectTrigger>
              <SelectContent>
                {MOTIFS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {motif === 'Autre' && (
              <Input
                placeholder="Précisez le motif..."
                value={motifAutre}
                onChange={e => setMotifAutre(e.target.value)}
                maxLength={200}
                className="mt-1.5"
              />
            )}
            <FieldError msg={errors.motif} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} className="medical-gradient border-0 text-primary-foreground">
            {rdv ? 'Enregistrer' : 'Planifier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RendezVousFormDialog;
