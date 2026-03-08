import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Identifiants incorrects. Essayez : dr.martin@clinique.fr ou admin@clinique.fr');
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
            <h1 className="text-2xl font-heading font-bold text-foreground">MédiClinic</h1>
            <p className="text-muted-foreground text-sm mt-1">Système de gestion clinique</p>
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
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="nom@clinique.fr" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full medical-gradient border-0 text-primary-foreground" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          <div className="mt-6 p-3 rounded-lg bg-accent text-accent-foreground text-xs space-y-1">
            <p className="font-semibold">Comptes démo :</p>
            <p>Médecin : dr.martin@clinique.fr</p>
            <p>Admin : admin@clinique.fr</p>
            <p className="text-muted-foreground">(Mot de passe : n'importe lequel)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
