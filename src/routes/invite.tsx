import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Download, 
  UserPlus, 
  LayoutDashboard,
  Heart,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export const Route = createFileRoute('/invite')({
  component: InvitePage,
});

function InvitePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate({ to: '/auth' });
      return;
    }

    const loadInviteCode = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.couple_id) {
        navigate({ to: '/auth' });
        return;
      }

      const { data: code } = await supabase.rpc('get_my_invite_code');
      setInviteCode(code as string);
      setIsLoading(false);

      // Subscribe to detect partner entry
      const channel = supabase
        .channel('invite-page-detection')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `couple_id=eq.${profile.couple_id}`
        }, async () => {
          if (!profile.couple_id) return;
          // Check if it's a new partner
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('couple_id', profile.couple_id);
          
          if (countData !== null && (countData as any) >= 2) {
            toast.success("Parceiro(a) conectado! Redirecionando...");
            setTimeout(() => navigate({ to: '/' }), 1500);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    loadInviteCode();
  }, [user, navigate]);

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const steps = [
    {
      icon: <Download className="w-5 h-5" />,
      title: "Baixe o App",
      description: "Peça para seu parceiro(a) acessar o site ou baixar o app."
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: "Insira o Código",
      description: "Ele(a) deve criar uma conta e inserir o código de convite."
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Comece a Usar",
      description: "Assim que ele(a) entrar, seu Dashboard será atualizado."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #161616, #203F9A, #4E7CB2, #E84797, #94C2DA, #E7A0CC, #EFE8E0)',
          opacity: 0.8
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4">
            <Heart size={32} className="fill-current" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Conecte seu Amor</h1>
          <p className="text-white/80">Envie o convite para começar a gerenciar juntos.</p>
        </div>

        <Card className="apple-card backdrop-blur-md bg-white/10 border-white/20 text-white overflow-hidden mb-6">
          <CardHeader className="text-center pb-2">
            <CardTitle>Seu Código de Convite</CardTitle>
            <CardDescription className="text-white/60">Válido para um único parceiro(a)</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="bg-white/10 rounded-3xl p-8 border border-white/10 text-center relative group">
              <span className="text-5xl font-black tracking-[0.2em] font-mono text-white animate-pulse">
                {inviteCode}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-white/20 text-white"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
              </Button>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg gap-3 bg-white text-primary hover:bg-white/90"
              onClick={handleCopy}
            >
              {copied ? "Copiado!" : "Copiar Código"}
              <Copy className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-white font-bold px-2">Como funciona:</h3>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 mt-1">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">{index + 1}. {step.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-xl gap-2"
            onClick={() => navigate({ to: '/' })}
          >
            Pular por enquanto
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
