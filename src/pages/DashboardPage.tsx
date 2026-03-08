import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPatients, mockConsultations, mockRendezVous } from '@/lib/mock-data';
import { Users, Stethoscope, CalendarDays, Activity } from 'lucide-react';

const stats = [
  { label: 'Patients', value: mockPatients.length, icon: Users, color: 'text-primary' },
  { label: 'Consultations', value: mockConsultations.length, icon: Stethoscope, color: 'text-secondary' },
  { label: 'RDV aujourd\'hui', value: 2, icon: CalendarDays, color: 'text-warning' },
  { label: 'En attente', value: 1, icon: Activity, color: 'text-success' },
];

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Bonjour, Dr. {user?.nom} 👋</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre activité clinique.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="glass-card hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-heading font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-accent ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRendezVous.slice(0, 3).map(rdv => {
              const patient = mockPatients.find(p => p.id === rdv.patientId);
              return (
                <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{patient?.prenom} {patient?.nom}</p>
                    <p className="text-xs text-muted-foreground">{rdv.motif}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{rdv.heure}</p>
                    <p className="text-xs text-muted-foreground">{rdv.date}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Dernières consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockConsultations.map(c => {
              const patient = mockPatients.find(p => p.id === c.patientId);
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{patient?.prenom} {patient?.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.diagnostic}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                    {c.statut === 'terminee' ? 'Terminée' : 'En cours'}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
