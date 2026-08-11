
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    confirmPasswordReset,
    verifyPasswordResetCode,
} from "firebase/auth";
import {
    LayoutDashboard,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { auth } from "../services/config";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Código enviado pelo Firebase no link do e-mail
    const oobCode = searchParams.get("oobCode");

    // ==========================================================
    // VALIDAR LINK DE RECUPERAÇÃO
    // ==========================================================

    useEffect(() => {
        const validateResetCode = async () => {
            if (!oobCode) {
                setError(
                    "Este link de recuperação é inválido ou está incompleto."
                );
                setIsLoading(false);
                return;
            }

            try {
                const userEmail = await verifyPasswordResetCode(
                    auth,
                    oobCode
                );

                setEmail(userEmail);
            } catch (error: any) {
                console.error(
                    "Erro ao validar link de recuperação:",
                    error
                );

                switch (error.code) {
                    case "auth/expired-action-code":
                        setError(
                            "Este link de recuperação expirou. Solicite um novo link."
                        );
                        break;

                    case "auth/invalid-action-code":
                        setError(
                            "Este link de recuperação é inválido ou já foi utilizado."
                        );
                        break;

                    case "auth/user-disabled":
                        setError(
                            "Esta conta foi desativada."
                        );
                        break;

                    default:
                        setError(
                            "Não foi possível validar este link de recuperação."
                        );
                }
            } finally {
                setIsLoading(false);
            }
        };

        validateResetCode();
    }, [oobCode]);

    // ==========================================================
    // ALTERAR SENHA
    // ==========================================================

    const handleResetPassword = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");

        if (!oobCode) {
            setError(
                "Link de recuperação inválido."
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "A senha deve possuir pelo menos 6 caracteres."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "As senhas não coincidem."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await confirmPasswordReset(
                auth,
                oobCode,
                newPassword
            );

            setIsSuccess(true);

            toast.success(
                "Senha alterada com sucesso!"
            );

        } catch (error: any) {
            console.error(
                "Erro ao redefinir senha:",
                error
            );

            switch (error.code) {
                case "auth/expired-action-code":
                    setError(
                        "Este link de recuperação expirou. Solicite um novo."
                    );
                    break;

                case "auth/invalid-action-code":
                    setError(
                        "Este link é inválido ou já foi utilizado."
                    );
                    break;

                case "auth/weak-password":
                    setError(
                        "A senha escolhida é muito fraca."
                    );
                    break;

                case "auth/user-disabled":
                    setError(
                        "Esta conta foi desativada."
                    );
                    break;

                default:
                    setError(
                        "Não foi possível alterar sua senha. Tente novamente."
                    );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================================
    // REDIRECIONAR PARA LOGIN
    // ==========================================================

    const handleGoToLogin = () => {
        navigate("/login", {
            replace: true,
        });
    };

    // ==========================================================
    // CARREGANDO LINK
    // ==========================================================

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-main text-text-main flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-brand-alert animate-spin" />

                    <p className="text-sm text-text-muted">
                        Validando link de recuperação...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-main flex text-text-main font-sans antialiased">

            {/* ==================================================
                COLUNA ESQUERDA
            ================================================== */}

            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-16">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <div className="bg-bg-card text-brand-alert p-2 rounded-xl border border-slate-700/50">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>

                        <span className="font-bold text-lg tracking-tight">
                            Focus<span className="text-brand-alert">Flow</span>
                        </span>

                    </div>

                    <Link
                        to="/login"
                        className="flex items-center gap-2 text-xs md:text-sm text-text-muted hover:text-text-main transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />

                        <span>
                            Voltar ao login
                        </span>
                    </Link>

                </div>

                {/* CONTEÚDO */}

                <div className="max-w-sm w-full mx-auto my-auto py-6">

                    {!isSuccess ? (

                        <>
                            <div className="text-center mb-8">

                                <div className="flex justify-center mb-5">

                                    <div className="bg-bg-card text-brand-alert p-4 rounded-2xl border border-brand-alert/30 shadow-lg shadow-brand-alert/10">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>

                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                    Criar nova senha
                                </h1>

                                <p className="text-xs md:text-sm text-text-muted mt-2 leading-relaxed">
                                    Defina uma nova senha segura para
                                    recuperar o acesso à sua conta.
                                </p>

                                {email && (
                                    <p className="text-xs text-brand-accent mt-3 break-all">
                                        {email}
                                    </p>
                                )}

                            </div>

                            {/* ERRO */}

                            {error && (
                                <div className="mb-6 p-3 rounded-xl bg-brand-alert/10 border border-brand-alert/30 text-brand-alert text-xs md:text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />

                                    <span>
                                        {error}
                                    </span>
                                </div>
                            )}

                            {/* FORM */}

                            {!error && (
                                <form
                                    onSubmit={handleResetPassword}
                                    className="space-y-4"
                                >

                                    {/* NOVA SENHA */}

                                    <div className="space-y-1.5">

                                        <label className="block text-xs font-semibold text-text-muted">
                                            Nova senha
                                        </label>

                                        <div className="relative">

                                            <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-10 pr-10 py-2.5 bg-bg-card/50 border border-slate-700/60 rounded-xl text-text-main text-sm placeholder-text-muted/40 focus:outline-none focus:border-brand-alert focus:ring-1 focus:ring-brand-alert transition-all"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                    {/* CONFIRMAR SENHA */}

                                    <div className="space-y-1.5">

                                        <label className="block text-xs font-semibold text-text-muted">
                                            Confirmar nova senha
                                        </label>

                                        <div className="relative">

                                            <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-10 pr-10 py-2.5 bg-bg-card/50 border border-slate-700/60 rounded-xl text-text-main text-sm placeholder-text-muted/40 focus:outline-none focus:border-brand-alert focus:ring-1 focus:ring-brand-alert transition-all"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                    {/* BOTÃO */}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 bg-brand-alert hover:bg-brand-alert/90 disabled:bg-brand-alert/50 text-text-main font-bold text-sm rounded-xl transition-all shadow-lg shadow-brand-alert/20 cursor-pointer"
                                    >
                                        {isSubmitting
                                            ? "Alterando..."
                                            : "Alterar senha"}
                                    </button>

                                </form>
                            )}

                            {/* LINK QUANDO O CÓDIGO É INVÁLIDO */}

                            {error && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/forgot-password"
                                        )
                                    }
                                    className="w-full mt-4 py-3 px-4 bg-bg-card hover:bg-bg-card/80 border border-slate-700/60 text-text-main font-semibold text-sm rounded-xl transition-all"
                                >
                                    Solicitar novo link
                                </button>
                            )}

                        </>

                    ) : (

                        /* ==================================================
                           SUCESSO
                        ================================================== */

                        <div className="text-center">

                            <div className="flex justify-center mb-6">

                                <div className="bg-brand-success/10 text-brand-success p-4 rounded-full border border-brand-success/30">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>

                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Senha alterada!
                            </h1>

                            <p className="text-sm text-text-muted mt-3 leading-relaxed">
                                Sua senha foi redefinida com sucesso.
                                Agora você pode entrar novamente na sua conta.
                            </p>

                            <button
                                type="button"
                                onClick={handleGoToLogin}
                                className="w-full mt-8 py-3 px-4 bg-brand-alert hover:bg-brand-alert/90 text-text-main font-bold text-sm rounded-xl transition-all shadow-lg shadow-brand-alert/20"
                            >
                                Ir para o login
                            </button>

                        </div>

                    )}

                </div>

                {/* FOOTER */}

                <div className="text-center text-xs text-text-muted">
                    Lembrou a senha?{" "}

                    <Link
                        to="/login"
                        className="text-brand-alert hover:underline font-medium"
                    >
                        Fazer login
                    </Link>
                </div>

            </div>

            {/* ==================================================
                COLUNA DIREITA
            ================================================== */}

            <div className="hidden lg:flex w-1/2 bg-bg-card border-l border-slate-800/80 relative overflow-hidden flex-col justify-center items-center p-12">

                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-alert/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-md text-center space-y-6 relative z-10">

                    <div className="flex justify-center">

                        <div className="p-5 rounded-2xl bg-bg-main border border-brand-alert/20">
                            <ShieldCheck className="w-12 h-12 text-brand-alert" />
                        </div>

                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-text-main">
                        Sua conta, suas regras
                    </h2>

                    <p className="text-sm text-text-muted leading-relaxed">
                        Crie uma nova senha e continue protegendo
                        seu acesso ao FocusFlow.
                    </p>

                    <div className="pt-8 grid grid-cols-3 gap-4 text-xs font-semibold tracking-wider uppercase">

                        <div className="p-3 bg-bg-main/40 rounded-xl border border-slate-800 text-text-muted">
                            Proteção
                        </div>

                        <div className="p-3 bg-bg-main/40 rounded-xl border border-slate-800 text-text-muted">
                            Segurança
                        </div>

                        <div className="p-3 bg-bg-main/40 rounded-xl border border-slate-800 text-text-muted">
                            Privacidade
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

