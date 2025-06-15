import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { currentUser } = useAuth();
  
  return (
    <div className="App">
      {currentUser ? <Dashboard /> : <Login />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;