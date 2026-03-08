import { useState } from 'react';
import { mockConsultations, mockPatients } from '@/lib/mock-data';
import { Consultation, Prescription } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Stethoscope, Pill, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ConsultationsPage = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: '', motif: '', symptomes: '', observations: '', diagnostic: '',
  });
  const [prescriptions, setPrescriptions] = useState<Omit<Prescription, 'id'>[]>([]);

  const addPrescription = () => setPrescriptions(prev => [...prev, { medicament: '', dosage: '', frequence: '', duree: '', instructions: '' }]);
  const removePrescription = (i: number) => setPrescriptions(prev => prev.filter((_, idx) => idx !== i));
  const updatePrescription = (i: number, field: string, value: string) =>
    setPrescriptions(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const consultation: Consultation = {
      id: `C${String(Date.now()).slice(-4)}`,
      ...form,
      medecinId: user?.id || '1',
      date: new Date().toISOString().split('T')[0],
      prescriptions: prescriptions.map((p, i) => ({ ...p, id: `RX${Date.now()}${i}` })),
      statut: 'terminee',
    };
    setConsultations(prev => [consultation, ...prev]);
    setShowForm(false);
    setForm({ patientId: '', motif: '', symptomes: '', observations: '', diagnostic: '' });
    setPrescriptions([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Consultations</h1>
          <p className="text-muted-foreground text-sm">{consultations.length} consultations enregistrées</p>
        </div>
        <Button className="medical-gradient border-0 text-primary-foreground" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle consultation
        </Button>
      </div>

      <div className="space-y-4">
        {consultations.map(c => {
          const patient = mockPatients.find(p => p.id === c.patientId);
          return (
            <Card key={c.id} className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{patient?.prenom} {patient?.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.motif} · {c.date}</p>
                    </div>
                  </div>
                  <Badge variant={c.statut === 'terminee' ? 'default' : 'secondary'}>
                    {c.statut === 'terminee' ? 'Terminée' : 'En cours'}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Symptômes :</span><p>{c.symptomes}</p></div>
                  <div><span className="text-muted-foreground">Observations :</span><p>{c.observations}</p></div>
                  <div><span className="text-muted-foreground">Diagnostic :</span><p className="font-medium">{c.diagnostic}</p></div>
                </div>
                {c.prescriptions.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {c.prescriptions.map(rx => (
                      <Badge key={rx.id} variant="outline" className="flex items-center gap-1">
                        <Pill className="h-3 w-3" /> {rx.medicament} {rx.dosage} – {rx.frequence}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Stethoscope className="h-5 w-5 text-primary" /> Nouvelle consultation
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Patient</Label>
              <Select value={form.patientId} onValueChange={v => setForm(prev => ({ ...prev, patientId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un patient" /></SelectTrigger>
                <SelectContent>
                  {mockPatients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Motif de consultation</Label>
              <Input placeholder="Ex: Douleurs thoraciques" value={form.motif} onChange={e => setForm(prev => ({ ...prev, motif: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Symptômes</Label>
              <Textarea placeholder="Décrivez les symptômes rapportés..." value={form.symptomes} onChange={e => setForm(prev => ({ ...prev, symptomes: e.target.value }))} rows={2} required />
            </div>
            <div className="space-y-1.5">
              <Label>Observations cliniques</Label>
              <Textarea placeholder="Résultats de l'examen clinique..." value={form.observations} onChange={e => setForm(prev => ({ ...prev, observations: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Diagnostic</Label>
              <Input placeholder="Diagnostic posé" value={form.diagnostic} onChange={e => setForm(prev => ({ ...prev, diagnostic: e.target.value }))} required />
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Pill className="h-4 w-4 text-primary" /> Prescriptions</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
                  <Plus className="mr-1 h-3 w-3" /> Ajouter
                </Button>
              </div>
              {prescriptions.map((rx, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3 p-3 rounded-lg bg-muted/50">
                  <Input placeholder="Médicament" value={rx.medicament} onChange={e => updatePrescription(i, 'medicament', e.target.value)} />
                  <Input placeholder="Dosage" value={rx.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                  <Input placeholder="Fréquence" value={rx.frequence} onChange={e => updatePrescription(i, 'frequence', e.target.value)} />
                  <Input placeholder="Durée" value={rx.duree} onChange={e => updatePrescription(i, 'duree', e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removePrescription(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" className="medical-gradient border-0 text-primary-foreground">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsPage;
