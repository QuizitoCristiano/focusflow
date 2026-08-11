import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexto/useAuth";

export const ProtectedRoute = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-100">
                Carregando...
            </div>
        );
    }

    // 1. Não autenticado → Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Identifica os métodos de autenticação
    const providerIds = user.providerData.map(
        (provider) => provider.providerId
    );

    const isGoogleUser = providerIds.includes("google.com");
    const isGithubUser = providerIds.includes("github.com");
    const isEmailUser = providerIds.includes("password");

    // 3. Google e GitHub não precisam passar pela verificação
    if (isGoogleUser || isGithubUser) {
        return <Outlet />;
    }

    // 4. Conta criada com e-mail/senha precisa verificar o e-mail
    if (isEmailUser && !user.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    // 5. Tudo certo
    return <Outlet />;
};