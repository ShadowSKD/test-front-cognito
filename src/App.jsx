import { useAuth } from './context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import AppRouter from './routes/AppRouter';
import Spinner from './components/ui/Spinner';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden text-textPrimary">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Spinner size="lg" color="primary" />
          <p className="text-textSecondary text-sm font-medium tracking-wide animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden text-textPrimary">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md glass-card p-8 md:p-10 text-center relative z-10 border border-white/5 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger mb-4 border border-danger/20">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Authentication Error
            </h2>
            <p className="text-textSecondary text-sm">
              An error occurred during authentication.
            </p>
          </div>
          <div className="bg-danger/5 border border-danger/10 rounded-xl p-4 mb-6 text-sm text-danger/90 font-mono text-left break-all">
            {auth.error.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-secondary hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary selection:bg-primary/30">
      <AppRouter />
    </div>
  );
}

export default App;
