import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Plus } from 'lucide-react';

const documents = [
  { id: 1, titre: 'Ordonnance – Sophie Lefebvre', type: 'Ordonnance', date: '2024-12-01' },
  { id: 2, titre: 'Certificat médical – Pierre Bernard', type: 'Certificat', date: '2024-12-10' },
  { id: 3, titre: 'Compte-rendu consultation – Sophie Lefebvre', type: 'Compte-rendu', date: '2024-12-01' },
];

const DocumentsPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-heading font-bold">Documents médicaux</h1>
        <p className="text-muted-foreground text-sm">Ordonnances, certificats et comptes-rendus</p>
      </div>
      <Button className="medical-gradient border-0 text-primary-foreground">
        <Plus className="mr-2 h-4 w-4" /> Générer un document
      </Button>
    </div>

    <div className="space-y-3">
      {documents.map(doc => (
        <Card key={doc.id} className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{doc.titre}</p>
                <p className="text-xs text-muted-foreground">{doc.type} · {doc.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default DocumentsPage;
