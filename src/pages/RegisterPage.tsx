import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', specialite: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      nom: form.nom,
      prenom: form.prenom,
      specialite: form.specialite,
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 medical-gradient opacity-5" />
      <Card className="w-full max-w-md relative animate-fade-in glass-card">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl medical-gradient flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Inscription Médecin</h1>
            <p className="text-muted-foreground text-sm mt-1">Créez votre compte clinicien</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" placeholder="Jean" value={form.prenom} onChange={e => update('prenom', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" placeholder="Martin" value={form.nom} onChange={e => update('nom', e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité</Label>
              <Input id="specialite" placeholder="Médecine générale" value={form.specialite} onChange={e => update('specialite', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="nom@clinique.fr" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="Min. 6 caractères" value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
            </div>
            <Button type="submit" className="w-full medical-gradient border-0 text-primary-foreground" disabled={loading}>
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
