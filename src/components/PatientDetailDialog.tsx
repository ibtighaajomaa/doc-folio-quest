import { Patient } from '@/lib/types';
import { mockConsultations } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Droplets, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

const PatientDetailDialog = ({ patient, onClose }: Props) => {
  if (!patient) return null;
  const consultations = mockConsultations.filter(c => c.patientId === patient.id);

  return (
    <Dialog open={!!patient} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5 text-accent-foreground" />
            </div>
            {patient.prenom} {patient.nom}
            <Badge variant="outline">{patient.id}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Sexe :</span> {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</div>
            <div><span className="text-muted-foreground">Né(e) le :</span> {patient.dateNaissance}</div>
            <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{patient.telephone}</div>
            <div className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{patient.email}</div>
            <div className="col-span-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{patient.adresse}, {patient.codePostal} {patient.ville}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            {patient.groupeSanguin && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-destructive" />
                <span>Groupe sanguin : <strong>{patient.groupeSanguin}</strong></span>
              </div>
            )}
            {patient.allergies && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Allergies : <strong>{patient.allergies}</strong></span>
              </div>
            )}
          </div>
          {patient.antecedents && (
            <div className="text-sm">
              <span className="text-muted-foreground">Antécédents :</span>
              <p className="mt-1">{patient.antecedents}</p>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-heading font-semibold text-sm flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" /> Historique des consultations
            </h3>
            {consultations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune consultation enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {consultations.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{c.motif}</span>
                      <span className="text-muted-foreground text-xs">{c.date}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Diagnostic : {c.diagnostic}</p>
                    {c.prescriptions.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {c.prescriptions.map(rx => (
                          <Badge key={rx.id} variant="secondary" className="text-xs">{rx.medicament} {rx.dosage}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailDialog;
