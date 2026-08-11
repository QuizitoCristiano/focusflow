import { AuthProvider } from "./contexto/AuthProvider";
import { GoalsProvider } from "./contexto/GoalsContext";
import { ScreenTimeProvider } from "./contexto/ScreenTimeContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <ScreenTimeProvider>
      <AppRoutes />
      </ScreenTimeProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}

export default App;