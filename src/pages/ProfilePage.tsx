import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Save, X, Pencil } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  if (!user) return null;

  const isMedecin = user.role === 'medecin';

  const handleSave = () => {
    if (!form.nom || !form.prenom || !form.email) {
      toast({ title: 'Erreur', description: 'Nom, prénom et e-mail sont obligatoires.', variant: 'destructive' });
      return;
    }
    const { id, role, ...rest } = form as any;
    updateUser(rest);
    setEditing(false);
    toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
  };

  const handleCancel = () => {
    setForm({ ...user });
    setEditing(false);
  };

  const onChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Mon profil</h1>
          <p className="text-muted-foreground text-sm">Consultez et modifiez vos informations</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" /> Modifier
          </Button>
        )}
      </div>

      {/* Avatar / Header */}
      <Card className="glass-card">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="w-16 h-16 rounded-full medical-gradient flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
            {user.prenom[0]}{user.nom[0]}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Dr. {user.prenom} {user.nom}</p>
            <p className="text-sm text-muted-foreground capitalize">{isMedecin ? user.specialite || 'Médecin' : 'Personnel administratif'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
          <CardDescription>Vos coordonnées et identité</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom" value={form.nom || ''} editing={editing} onChange={v => onChange('nom', v)} />
          <Field label="Prénom" value={form.prenom || ''} editing={editing} onChange={v => onChange('prenom', v)} />
          <Field label="E-mail" value={form.email || ''} editing={editing} onChange={v => onChange('email', v)} type="email" />
          <Field label="Téléphone" value={form.telephone || ''} editing={editing} onChange={v => onChange('telephone', v)} type="tel" />
          <Field label="Adresse" value={form.adresse || ''} editing={editing} onChange={v => onChange('adresse', v)} className="sm:col-span-2" />
          <Field label="Ville" value={form.ville || ''} editing={editing} onChange={v => onChange('ville', v)} />
          <Field label="Code postal" value={form.codePostal || ''} editing={editing} onChange={v => onChange('codePostal', v)} />
        </CardContent>
      </Card>

      {/* Professional Info (medecin only) */}
      {isMedecin && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Informations professionnelles</CardTitle>
            <CardDescription>Spécialité et numéro d'ordre</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Spécialité" value={form.specialite || ''} editing={editing} onChange={v => onChange('specialite', v)} />
            <Field label="N° Ordre" value={form.numeroOrdre || ''} editing={editing} onChange={v => onChange('numeroOrdre', v)} />
          </CardContent>
        </Card>
      )}

      {editing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X className="h-4 w-4" /> Annuler
          </Button>
          <Button onClick={handleSave} className="medical-gradient border-0 text-primary-foreground gap-2">
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, editing, onChange, type = 'text', className = '' }: {
  label: string; value: string; editing: boolean; onChange: (v: string) => void; type?: string; className?: string;
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-muted-foreground text-xs">{label}</Label>
    {editing ? (
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} />
    ) : (
      <p className="text-sm text-foreground font-medium min-h-[2.5rem] flex items-center">{value || '—'}</p>
    )}
  </div>
);

export default ProfilePage;
