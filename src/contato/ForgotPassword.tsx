import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
//import { auth } from '../services/firebase';
import { LayoutDashboard, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { auth } from '@/services/config';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(
        auth,
        email.trim(),
        actionCodeSettings
      );

      setSuccessMessage(
        'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
      );

      setEmail('');

    } catch (err: any) {
      console.error(
        'Erro na recuperação de senha:',
        err.code
      );

      switch (err.code) {
        case 'auth/user-not-found':
          setError(
            'Nenhuma conta encontrada com este e-mail.'
          );
          break;

        case 'auth/invalid-email':
          setError(
            'O e-mail digitado não é válido.'
          );
          break;

        case 'auth/unauthorized-continue-uri':
          setError(
            'A URL de recuperação não está autorizada no Firebase.'
          );
          break;

        default:
          setError(
            'Falha ao enviar e-mail de recuperação. Tente novamente.'
          );
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#121212] flex text-white font-sans antialiased">

      {/* 👈 COLUNA DA ESQUERDA: Formulário de Recuperação */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-16">

        {/* Topo: Logo + Link para Voltar ao Login */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#2A2D32] text-[#FF5733] p-2 rounded-xl border border-slate-700/50">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Focus<span className="text-[#FF5733]">Flow</span>
            </span>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 text-xs md:text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao login</span>
          </Link>
        </div>

        {/* Centro: Form de Esqueci Minha Senha */}
        <div className="max-w-sm w-full mx-auto my-auto py-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Recuperar Senha
            </h1>
            <p className="text-xs md:text-sm text-[#9CA3AF] mt-2">
              Informe seu e-mail cadastrado e enviaremos as instruções para redefinir sua senha.
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] text-xs md:text-sm flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">

            {/* Campo E-mail */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#9CA3AF]">E-mail de cadastro</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2A2D32]/50 border border-slate-700/60 rounded-xl text-white text-sm placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#FF5733] focus:ring-1 focus:ring-[#FF5733] transition-all"
                />
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#FF5733] hover:bg-[#FF5733]/90 disabled:bg-[#FF5733]/50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FF5733]/20 cursor-pointer mt-2"
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-[#9CA3AF]">
          Lembrou a senha?{' '}
          <Link to="/login" className="text-[#FF5733] hover:underline font-medium">
            Fazer login
          </Link>
        </div>
      </div>

      {/* 👉 COLUNA DA DIREITA: Card de Destaque / Identidade */}
      <div className="hidden lg:flex w-1/2 bg-[#1E2022] border-l border-slate-800/80 relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF5733]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Segurança em primeiro lugar
          </h2>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Mantenha seu acesso protegido. Enviamos links seguros com prazo de expiração para garantir que apenas você acesse a sua conta.
          </p>

          <div className="pt-8 grid grid-cols-3 gap-4 text-xs font-semibold tracking-wider uppercase">

            {/* 1. Mintlify */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#00D26A]/60 text-[#9CA3AF] hover:text-[#00D26A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(0,210,106,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#00D26A] group-hover:shadow-[0_0_8px_#00D26A] transition-all duration-300" />
              <span>MINTLIFY</span>
            </div>

            {/* 2. Santander */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#EC0000]/60 text-[#9CA3AF] hover:text-[#EC0000] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(236,0,0,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#EC0000] group-hover:shadow-[0_0_8px_#EC0000] transition-all duration-300" />
              <span>SANTANDER</span>
            </div>

            {/* 3. Infisical */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#F59E0B]/60 text-[#9CA3AF] hover:text-[#F59E0B] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(245,158,11,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#F59E0B] group-hover:shadow-[0_0_8px_#F59E0B] transition-all duration-300" />
              <span>INFISICAL</span>
            </div>

            {/* 4. Koywe */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#00C6FF]/60 text-[#9CA3AF] hover:text-[#00C6FF] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(0,198,255,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#00C6FF] group-hover:shadow-[0_0_8px_#00C6FF] transition-all duration-300" />
              <span>KOYWE</span>
            </div>

            {/* 5. Netmaker */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#8B5CF6]/60 text-[#9CA3AF] hover:text-[#8B5CF6] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#8B5CF6] group-hover:shadow-[0_0_8px_#8B5CF6] transition-all duration-300" />
              <span>NETMAKER</span>
            </div>

            {/* 6. Bradesco */}
            <div className="group relative flex items-center justify-center gap-2 p-3 bg-[#2A2D32]/40 hover:bg-[#2A2D32] rounded-xl border border-slate-800/80 hover:border-[#CC092F]/60 text-[#9CA3AF] hover:text-[#CC092F] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(204,9,47,0.35)] cursor-default">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#CC092F] group-hover:shadow-[0_0_8px_#CC092F] transition-all duration-300" />
              <span>BRADESCO</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};