import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCog, Mail } from 'lucide-react';

const MedecinsPage = () => {
  const medecins = mockUsers.filter(u => u.role === 'medecin');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Médecins</h1>
        <p className="text-muted-foreground text-sm">{medecins.length} médecin(s) enregistré(s)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medecins.map(m => (
          <Card key={m.id} className="glass-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full medical-gradient flex items-center justify-center">
                <UserCog className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Dr. {m.prenom} {m.nom}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{m.email}</p>
                <Badge variant="secondary" className="mt-1">Médecin généraliste</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedecinsPage;
