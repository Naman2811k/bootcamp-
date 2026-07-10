import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./Auth.context";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
