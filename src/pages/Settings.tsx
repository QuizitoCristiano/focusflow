import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Lock, 
  Camera, 
  KeyRound, 
  LogOut, 
  FileText, 
  Trash2, 
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexto/useAuth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/services/config';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [reminders, setReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [timeUnit, setTimeUnit] = useState<'hours' | 'minutes'>('hours');
  const [language, setLanguage] = useState('pt-BR');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Função para mascarar o e-mail por segurança
  const maskEmail = (email?: string | null) => {
    if (!email) return '***@***.com';
    const [name, domain] = email.split('@');
    if (!domain) return '***';

    const maskedName = name.length > 3 
      ? `${name.substring(0, 2)}***${name.slice(-2)}` 
      : `${name.substring(0, 1)}***`;

    const domainParts = domain.split('.');
    const maskedDomain = domainParts[0].length > 2
      ? `${domainParts[0].substring(0, 2)}***`
      : `${domainParts[0].substring(0, 1)}***`;

    return `${maskedName}@${maskedDomain}.${domainParts.slice(1).join('.')}`;
  };

  // Carrega os dados reais do usuário (Prioridade: Firestore -> Auth)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userDocRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setDisplayName(data.displayName || user.displayName || '');
          setPhotoURL(data.photoURL || user.photoURL || '');
          if (data.settings) {
            setReminders(data.settings.reminders ?? true);
            setWeeklyReports(data.settings.weeklyReports ?? true);
            setGoalAlerts(data.settings.goalAlerts ?? true);
            setTheme(data.settings.theme || 'dark');
            setTimeUnit(data.settings.timeUnit || 'hours');
            setLanguage(data.settings.language || 'pt-BR');
          }
        } else {
          // Fallback para o perfil autenticado no Auth
          setDisplayName(user.displayName || '');
          setPhotoURL(user.photoURL || '');
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handler para selecionar a foto da galeria do celular/computador
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Cria preview temporário para o usuário visualizar na hora
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  // Salva no Firestore e no Firebase Storage
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let finalPhotoURL = photoURL;

      // 1. Faz upload do arquivo para o Firebase Storage se houver uma nova foto selecionada
      if (selectedFile) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, selectedFile);
        finalPhotoURL = await getDownloadURL(storageRef);
      }

      // 2. Atualiza o Perfil do Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: finalPhotoURL
        });
      }

      // 3. Atualiza na coleção "users" do Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName,
        photoURL: finalPhotoURL,
        email: user.email,
        settings: {
          reminders,
          weeklyReports,
          goalAlerts,
          theme,
          timeUnit,
          language
        },
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar no Firestore:', err);
      alert('Ocorreu um erro ao salvar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert(`E-mail de redefinição enviado para ${user.email}. Você será desconectado.`);
      await signOut(auth);
    } catch (err) {
      console.error('Erro ao enviar e-mail de redefinição:', err);
      alert('Falha ao enviar e-mail de redefinição de senha.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'Atenção: Esta ação excluirá permanentemente seus dados do FocusFlow. Deseja continuar?'
    );
    if (confirm) {
      alert('Para a exclusão total dos dados conforme LGPD, entre em contato com o suporte.');
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12 text-text-muted text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando configurações...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12 select-none">
      <div>
        <h1 className="text-2xl font-bold text-text-main">⚙️ Configurações</h1>
        <p className="text-sm text-text-muted mt-1">
          Gerencie suas preferências de conta, privacidade e experiência no FocusFlow.
        </p>
      </div>

      {/* 1. Minha Conta */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <User className="w-5 h-5 text-brand-alert" />
          <h2 className="text-lg font-bold text-text-main">1. Minha conta</h2>
        </div>

        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-main border border-white/10 flex items-center justify-center text-text-muted relative overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8" />
              )}
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-brand-alert p-1.5 rounded-lg text-white hover:scale-105 transition-transform"
                title="Escolher foto da galeria"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Input de arquivo escondido para abrir arquivos do celular/PC */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">Foto de perfil</p>
              <p className="text-xs text-text-muted">Clique na câmera para selecionar da galeria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Nome
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-bg-main border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-alert transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                E-mail (Protegido por privacidade)
              </label>
              <input
                type="text"
                value={maskEmail(user?.email)}
                readOnly
                title="O e-mail está mascarado por questões de segurança"
                className="w-full bg-bg-main/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-muted cursor-not-allowed opacity-75 select-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar alterações
            </button>
          </div>
        </form>
      </section>

      {/* 2. Segurança */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <ShieldCheck className="w-5 h-5 text-brand-accent" />
          <h2 className="text-lg font-bold text-text-main">2. Segurança</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-bg-main rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold text-text-main">Senha</p>
              <p className="text-xs text-text-muted">Enviaremos um e-mail para você redefinir sua senha.</p>
            </div>
            <button 
              onClick={handlePasswordReset}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-text-main font-semibold rounded-xl text-sm border border-white/10 transition-all flex items-center gap-2 shrink-0"
            >
              <KeyRound className="w-4 h-4 text-brand-accent" /> Alterar senha
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-bg-main rounded-xl border border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-text-main">E-mail</p>
                {user?.emailVerified && (
                  <span className="text-xs font-medium text-brand-success flex items-center gap-1 bg-brand-success/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> E-mail verificado
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {user?.emailVerified ? 'Seu e-mail está verificado.' : 'Seu e-mail ainda não foi verificado.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-bg-main rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold text-text-main">Sessões</p>
              <p className="text-xs text-text-muted">Desconectar sua conta deste dispositivo.</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-brand-alert/10 hover:bg-brand-alert/20 text-brand-alert font-semibold rounded-xl text-sm border border-brand-alert/30 transition-all flex items-center gap-2 shrink-0"
            >
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </div>
        </div>
      </section>

      {/* 3. Notificações */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <Bell className="w-5 h-5 text-brand-alert" />
          <h2 className="text-lg font-bold text-text-main">3. Notificações</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-main">Lembretes de registro</p>
              <p className="text-xs text-text-muted">Receber lembrete para registrar meu tempo de tela.</p>
            </div>
            <input
              type="checkbox"
              checked={reminders}
              onChange={(e) => setReminders(e.target.checked)}
              className="w-5 h-5 accent-brand-alert rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-main">Relatório semanal</p>
              <p className="text-xs text-text-muted">Receber aviso quando um novo relatório estiver disponível.</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyReports}
              onChange={(e) => setWeeklyReports(e.target.checked)}
              className="w-5 h-5 accent-brand-alert rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-main">Alertas de meta</p>
              <p className="text-xs text-text-muted">Avisar quando meu uso ultrapassar minha meta.</p>
            </div>
            <input
              type="checkbox"
              checked={goalAlerts}
              onChange={(e) => setGoalAlerts(e.target.checked)}
              className="w-5 h-5 accent-brand-alert rounded cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 4. Preferências */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <Sliders className="w-5 h-5 text-brand-accent" />
          <h2 className="text-lg font-bold text-text-main">4. Preferências</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Tema
            </label>
            <div className="flex items-center gap-4">
              {[
                { id: 'dark', label: 'Escuro' },
                { id: 'light', label: 'Claro' },
                { id: 'system', label: 'Sistema' }
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === item.id}
                    onChange={() => setTheme(item.id as any)}
                    className="accent-brand-alert"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Idiomas
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-64 bg-bg-main border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-alert transition-colors"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Unidade de tempo
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
                <input
                  type="radio"
                  name="timeUnit"
                  checked={timeUnit === 'hours'}
                  onChange={() => setTimeUnit('hours')}
                  className="accent-brand-alert"
                />
                Horas e minutos
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
                <input
                  type="radio"
                  name="timeUnit"
                  checked={timeUnit === 'minutes'}
                  onChange={() => setTimeUnit('minutes')}
                  className="accent-brand-alert"
                />
                Apenas minutos
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacidade e dados (LGPD) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <Lock className="w-5 h-5 text-brand-alert" />
          <h2 className="text-lg font-bold text-text-main">5. Privacidade e dados</h2>
        </div>

        <p className="text-sm text-text-muted">
          Seus dados pertencem a você. Garantimos transparência e controle total conforme a LGPD.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-bg-main rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold text-text-main">Documentos e Termos</p>
              <p className="text-xs text-text-muted">Consulte como tratamos suas informações.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-text-main text-xs font-semibold rounded-lg border border-white/10 transition-all flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Política de Privacidade
              </button>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-text-main text-xs font-semibold rounded-lg border border-white/10 transition-all flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Termos de Uso
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-brand-alert/10 border border-brand-alert/30 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-text-main">Excluir minha conta</p>
              <p className="text-xs text-text-muted">
                Esta ação removerá permanentemente seus dados do FocusFlow.
              </p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Excluir minha conta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};