import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


// Páginas do seu escopo
//import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from '@/componentes/Autenticacao/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/contato/Login';
import { Register } from '@/contato/Register';
import { ForgotPassword } from '@/contato/ForgotPassword';
import { WellnessDashboard } from '@/pages/WellnessDashboard';
import { VerifyEmail } from '@/VerifyEmail/VerifyEmail';
import { ResetPassword } from '@/contato/ResetPassword';
import { Settings } from '@/pages/Settings';
import { Diagnostic } from '@/pages/Diagnostic';
import { ScreenTime } from '@/pages/ScreenTime';
import { History } from '@/pages/History';
import { Reports } from '@/pages/Reports';
import { Recommendations } from '@/pages/Recommendations';
import { Goals } from '@/pages/Goals';
import { Legal } from '@/privacy/Legal';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS / AUTENTICAÇÃO */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />}
        />
        {/* 🛡️ ROTAS PROTEGIDAS (Apenas usuários autenticados) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/WellnessDashboard' element={<WellnessDashboard />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/diagnostic' element={<Diagnostic />} />
            <Route path='/recommendations' element={<Recommendations />} />
            <Route path='/goals' element={<Goals/>} />
            <Route path='/screenTime' element={<ScreenTime />} />
            <Route path='/history' element={<History/>}/>
            <Route path='/reports' element={<Reports/>}/>
            <Route path='/modo-de-uso' element={<Legal/>}/>


            {/* Redireciona a raiz '/' para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

          </Route>
        </Route>

        {/* 🔄 REDIRECIONAMENTO DE SEGURANÇA (Rota 404 / Não encontrada) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}