import { useState } from 'react';
import { mockConsultations, mockPatients, mockRendezVous, mockUsers } from '@/lib/mock-data';
import { Consultation, Prescription, Patient, RendezVous } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Plus, Stethoscope, Pill, Trash2, CalendarDays, Clock, User,
  Phone, Mail, MapPin, Droplets, AlertTriangle, FileText, ArrowLeft, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'patient-profile' | 'new-consultation';

const statutColors: Record<string, string> = {
  planifie: 'bg-warning/10 text-warning',
  confirme: 'bg-success/10 text-success',
  annule: 'bg-destructive/10 text-destructive',
  termine: 'bg-muted text-muted-foreground',
};
const statutLabels: Record<string, string> = {
  planifie: 'Planifié', confirme: 'Confirmé', annule: 'Annulé', termine: 'Terminé',
};

const ConsultationsPage = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consentement, setConsentement] = useState(false);

  const [form, setForm] = useState({
    motif: '', symptomes: '', observations: '', diagnostic: '', notesMedecin: '',
  });
  const [prescriptions, setPrescriptions] = useState<Omit<Prescription, 'id'>[]>([]);

  const rdvs = mockRendezVous;

  const addPrescription = () => setPrescriptions(prev => [...prev, { medicament: '', dosage: '', frequence: '', duree: '', instructions: '' }]);
  const removePrescription = (i: number) => setPrescriptions(prev => prev.filter((_, idx) => idx !== i));
  const updatePrescription = (i: number, field: string, value: string) =>
    setPrescriptions(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const handlePatientClick = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setViewMode('patient-profile');
    }
  };

  const startNewConsultation = (patient?: Patient) => {
    if (patient) setSelectedPatient(patient);
    setViewMode('new-consultation');
    setConsentement(false);
    setForm({ motif: '', symptomes: '', observations: '', diagnostic: '', notesMedecin: '' });
    setPrescriptions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentement) {
      toast({ title: 'Consentement requis', description: 'Le patient doit donner son consentement avant l\'enregistrement.', variant: 'destructive' });
      return;
    }
    if (!selectedPatient) return;
    const consultation: Consultation = {
      id: `C${String(Date.now()).slice(-4)}`,
      patientId: selectedPatient.id,
      medecinId: user?.id || '1',
      date: new Date().toISOString().split('T')[0],
      motif: form.motif,
      symptomes: form.symptomes,
      observations: form.observations,
      diagnostic: form.diagnostic,
      prescriptions: prescriptions.map((p, i) => ({ ...p, id: `RX${Date.now()}${i}` })),
      statut: 'terminee',
    };
    setConsultations(prev => [consultation, ...prev]);
    toast({ title: 'Consultation enregistrée', description: `Consultation pour ${selectedPatient.prenom} ${selectedPatient.nom} sauvegardée.` });
    setViewMode('list');
    setSelectedPatient(null);
  };

  const backToList = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  const patientConsultations = selectedPatient
    ? consultations.filter(c => c.patientId === selectedPatient.id)
    : [];

  // ── Patient Profile Panel ──
  const PatientProfilePanel = ({ patient }: { patient: Patient }) => (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
          <User className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">{patient.prenom} {patient.nom}</h2>
          <Badge variant="outline">{patient.id}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="text-muted-foreground">Sexe :</span> {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</div>
        <div><span className="text-muted-foreground">Né(e) le :</span> {patient.dateNaissance}</div>
        <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{patient.telephone}</div>
        <div className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{patient.email}</div>
        <div className="col-span-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{patient.adresse}, {patient.codePostal} {patient.ville}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {patient.groupeSanguin && (
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-destructive" />
            <span>Groupe : <strong>{patient.groupeSanguin}</strong></span>
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
        {patientConsultations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune consultation enregistrée.</p>
        ) : (
          <div className="space-y-3">
            {patientConsultations.map(c => (
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
  );

  // ── LIST VIEW: Rendez-vous ──
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Consultations</h1>
            <p className="text-muted-foreground text-sm">{rdvs.length} rendez-vous · {consultations.length} consultations</p>
          </div>
          <Button className="medical-gradient border-0 text-primary-foreground" onClick={() => startNewConsultation()}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle consultation
          </Button>
        </div>

        <div className="space-y-3">
          {rdvs.map(rdv => {
            const patient = mockPatients.find(p => p.id === rdv.patientId);
            const medecin = mockUsers.find(u => u.id === rdv.medecinId);
            return (
              <Card key={rdv.id} className="glass-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => patient && handlePatientClick(patient.id)}>
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
                      {medecin && <p className="text-xs text-muted-foreground">Dr. {medecin.prenom} {medecin.nom}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statutColors[rdv.statut]} border-0`}>{statutLabels[rdv.statut]}</Badge>
                    <Button variant="outline" size="sm"
                      onClick={e => { e.stopPropagation(); patient && startNewConsultation(mockPatients.find(p => p.id === rdv.patientId)!); }}>
                      <Stethoscope className="mr-1 h-3 w-3" /> Consulter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PATIENT PROFILE VIEW ──
  if (viewMode === 'patient-profile' && selectedPatient) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={backToList}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-heading font-bold">Profil patient</h1>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6">
            <PatientProfilePanel patient={selectedPatient} />
            <div className="mt-6">
              <Button className="medical-gradient border-0 text-primary-foreground" onClick={() => startNewConsultation(selectedPatient)}>
                <Plus className="mr-2 h-4 w-4" /> Nouvelle consultation pour ce patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── NEW CONSULTATION: Split View ──
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={backToList}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-heading font-bold">Nouvelle consultation</h1>
      </div>

      {!selectedPatient ? (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-heading font-semibold">Sélectionner un patient</h2>
            <div className="grid gap-3">
              {mockPatients.map(p => (
                <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPatient(p)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.prenom} {p.nom}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · {p.telephone}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Patient Profile + History */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <PatientProfilePanel patient={selectedPatient} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* RIGHT: Consultation Form */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-heading font-semibold flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" /> Formulaire de consultation
                  </h2>

                  <div className="space-y-1.5">
                    <Label>Motif de consultation</Label>
                    <Input placeholder="Ex: Douleurs thoraciques" value={form.motif}
                      onChange={e => setForm(prev => ({ ...prev, motif: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Symptômes</Label>
                    <Textarea placeholder="Décrivez les symptômes rapportés..." value={form.symptomes}
                      onChange={e => setForm(prev => ({ ...prev, symptomes: e.target.value }))} rows={2} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Observations cliniques</Label>
                    <Textarea placeholder="Résultats de l'examen clinique..." value={form.observations}
                      onChange={e => setForm(prev => ({ ...prev, observations: e.target.value }))} rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Diagnostic</Label>
                    <Input placeholder="Diagnostic posé" value={form.diagnostic}
                      onChange={e => setForm(prev => ({ ...prev, diagnostic: e.target.value }))} required />
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <Label>Notes du médecin</Label>
                    <Textarea placeholder="Notes personnelles, recommandations, suivi prévu..."
                      value={form.notesMedecin}
                      onChange={e => setForm(prev => ({ ...prev, notesMedecin: e.target.value }))} rows={3} />
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" /> Prescriptions
                      </h3>
                      <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
                        <Plus className="mr-1 h-3 w-3" /> Ajouter
                      </Button>
                    </div>
                    {prescriptions.map((rx, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2 mb-3 p-3 rounded-lg bg-muted/50">
                        <Input placeholder="Médicament" value={rx.medicament} onChange={e => updatePrescription(i, 'medicament', e.target.value)} />
                        <Input placeholder="Dosage" value={rx.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                        <Input placeholder="Fréquence" value={rx.frequence} onChange={e => updatePrescription(i, 'frequence', e.target.value)} />
                        <div className="flex gap-2">
                          <Input placeholder="Durée" value={rx.duree} onChange={e => updatePrescription(i, 'duree', e.target.value)} />
                          <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removePrescription(i)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Consentement */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <Checkbox id="consentement" checked={consentement} onCheckedChange={(v) => setConsentement(v === true)} className="mt-0.5" />
                    <div>
                      <Label htmlFor="consentement" className="font-semibold flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="h-4 w-4 text-primary" /> Consentement du patient
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Le patient a été informé et consent au traitement de ses données médicales et à l'enregistrement de cette consultation.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={backToList}>Annuler</Button>
                    <Button type="submit" className="medical-gradient border-0 text-primary-foreground" disabled={!consentement}>
                      <ShieldCheck className="mr-2 h-4 w-4" /> Enregistrer la consultation
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
