import { useState } from 'react';
import { mockRendezVous, mockPatients } from '@/lib/mock-data';
import { RendezVous } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Plus } from 'lucide-react';

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
  const [rdvs] = useState<RendezVous[]>(mockRendezVous);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Rendez-vous</h1>
          <p className="text-muted-foreground text-sm">{rdvs.length} rendez-vous</p>
        </div>
        <Button className="medical-gradient border-0 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Nouveau RDV
        </Button>
      </div>

      <div className="space-y-3">
        {rdvs.map(rdv => {
          const patient = mockPatients.find(p => p.id === rdv.patientId);
          return (
            <Card key={rdv.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-heading font-bold text-primary">{rdv.heure}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" />{rdv.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{patient?.prenom} {patient?.nom}</p>
                    <p className="text-xs text-muted-foreground">{rdv.motif}</p>
                  </div>
                </div>
                <Badge className={`${statutColors[rdv.statut]} border-0`}>{statutLabels[rdv.statut]}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RendezVousPage;
