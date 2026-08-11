import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MailCheck, LayoutDashboard, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import {
    sendVerificationEmail,
    reloadCurrentUser,
    isEmailVerified,
    logoutUser,
} from "../auth/auth.service";

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================================
    // REENVIAR E-MAIL
    // ==========================================================
    const handleResend = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await sendVerificationEmail();
            toast.success("Um novo e-mail de verificação foi enviado.");
        } catch (error) {
            console.error(error);
            toast.error("Não foi possível reenviar o e-mail.");
        } finally {
            setIsLoading(false);
        }
    };


    // ==========================================================
    // REDIRECIONAR PARA O LOGIN APÓS CONFIRMAÇÃO
    // ==========================================================
    const handleAlreadyVerified = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            // ======================================================
            // TENTA ATUALIZAR O USUÁRIO ATUAL
            // ======================================================
            try {
                await reloadCurrentUser();

                // Se existe usuário autenticado e o e-mail
                // foi confirmado, podemos seguir para o login.
                if (isEmailVerified()) {
                    toast.success("E-mail confirmado com sucesso!");

                    await logoutUser();

                    navigate("/login", { replace: true });

                    return;
                }

                // Usuário existe, mas ainda não confirmou.
                toast.warning(
                    "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada."
                );

                return;

            } catch (error: any) {

                // ==================================================
                // NÃO EXISTE USUÁRIO AUTENTICADO NO NAVEGADOR
                // ==================================================
                if (
                    error?.message ===
                    "Nenhum usuário autenticado."
                ) {
                    // Não conseguimos consultar o status pelo
                    // usuário atual, então deixamos o próprio
                    // Login fazer a validação definitiva.
                    navigate("/login", { replace: true });

                    return;
                }

                throw error;
            }

        } catch (error) {
            console.error(
                "Erro ao verificar confirmação do e-mail:",
                error
            );

            toast.error(
                "Não foi possível verificar o status do seu e-mail."
            );
        } finally {
            setIsLoading(false);
        }
    };





    return (
        <div className="relative min-h-screen bg-[#121212] text-white font-sans flex flex-col justify-between p-6 md:p-10 overflow-hidden select-none">

            {/* =====================================================
          FUNDO: EFEITO METEOROS CRUZADOS EM X (SURREAL)
      ====================================================== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Orbes Neon Suaves */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5733]/15 rounded-full blur-[140px]" />
                <div className="absolute -bottom-32 right-10 w-[400px] h-[300px] bg-[#FF5733]/10 rounded-full blur-[120px]" />

                {/* ↘️ METEOROS DA DIREITA -> ESQUERDA */}
                <span className="absolute top-0 right-1/4 w-[120px] h-[1px] meteor-line-right animate-meteor-right [animation-delay:0s] [animation-duration:4s]" />
                <span className="absolute top-20 right-10 w-[140px] h-[1px] meteor-line-right animate-meteor-right [animation-delay:2.2s] [animation-duration:5s]" />
                <span className="absolute top-1/2 right-1/3 w-[100px] h-[1px] meteor-line-right animate-meteor-right [animation-delay:1.1s] [animation-duration:3.8s]" />

                {/* ↙️ METEOROS DA ESQUERDA -> DIREITA (CORTANDO EM X NO MEIO) */}
                <span className="absolute top-0 left-1/4 w-[130px] h-[1px] meteor-line-left animate-meteor-left [animation-delay:1s] [animation-duration:4.5s]" />
                <span className="absolute top-28 left-10 w-[150px] h-[1px] meteor-line-left animate-meteor-left [animation-delay:3.2s] [animation-duration:5.5s]" />
                <span className="absolute top-1/3 left-1/3 w-[110px] h-[1px] meteor-line-left animate-meteor-left [animation-delay:0.5s] [animation-duration:4s]" />
            </div>

            {/* =====================================================
          HEADER
      ====================================================== */}
            <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-[#2A2D32] text-[#FF5733] p-2 rounded-xl border border-slate-700/50 shadow-md">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Focus<span className="text-[#FF5733]">Flow</span>
                    </span>
                </div>

                <Link
                    to="/login"
                    className="px-4 py-2 bg-[#2A2D32]/80 hover:bg-slate-700 text-xs md:text-sm font-medium rounded-xl transition-all border border-slate-700/60 backdrop-blur-md"
                >
                    Voltar ao Login
                </Link>
            </header>

            {/* =====================================================
          CARD PRINCIPAL
      ====================================================== */}
            <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
                <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-[#FF5733]/30 shadow-2xl backdrop-blur-2xl">

                    <div className="bg-[#1E2022]/90 rounded-[23px] p-8 md:p-10 flex flex-col items-center text-center backdrop-blur-xl">

                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-[#FF5733]/30 rounded-full blur-xl animate-pulse" />
                            <div className="relative bg-[#2A2D32] border border-[#FF5733]/40 p-4 rounded-2xl text-[#FF5733] shadow-lg">
                                <MailCheck className="w-10 h-10" />
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                            Verifique seu e-mail
                        </h1>

                        <p className="text-xs md:text-sm text-[#9CA3AF] mt-3 leading-relaxed">
                            Enviamos um link de confirmação para o seu endereço de e-mail.
                            Abra sua caixa de entrada e confirme sua conta para liberar o acesso total ao <strong className="text-white">FocusFlow</strong>.
                        </p>

                        <div className="w-full space-y-3 mt-8">
                            <button
                                onClick={handleAlreadyVerified}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FF5733] hover:bg-[#FF5733]/90 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FF5733]/25 cursor-pointer active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Já confirmei meu e-mail</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleResend}
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-[#2A2D32]/60 hover:bg-[#2A2D32] border border-slate-700/60 disabled:opacity-50 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                                Reenviar e-mail de verificação
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            {/* =====================================================
          FOOTER
      ====================================================== */}
            <footer className="relative z-10 text-center text-xs text-[#9CA3AF]">
                FocusFlow &copy; {new Date().getFullYear()} &bull; Todos os direitos reservados.
            </footer>

        </div>
    );
};