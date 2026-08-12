import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../auth.slice";

// Same system as the landing page: ink navy board, one amber accent, thin
// borders, sharp corners, serif display type. No dual blue/cyan glow orbs,
// no backdrop-blur glass card, no gradient-clip heading. All auth logic
// below is unchanged from the original — only the JSX/classes moved.

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://unravel-bm4y.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(setUser(data.user));
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
        .unravel-input:focus { border-color: #E8A33D; }
      `}</style>

      <div className="relative w-full max-w-md">
        <div className="bg-[#0F1219] border border-white/10 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="unravel-display italic text-3xl md:text-4xl font-medium text-[#EDEAE2] mb-2">
              Welcome back
            </h1>
            <p className="unravel-body text-[#8B8F98] text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-[#E8352B]/10 border border-[#E8352B]/30">
              <p className="unravel-body text-[#F0897F] text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="unravel-mono block text-[11px] text-[#8B8F98] tracking-[0.1em] mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="unravel-input unravel-body w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 text-[#EDEAE2] placeholder-[#5B5F68] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="unravel-mono block text-[11px] text-[#8B8F98] tracking-[0.1em] mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="unravel-input unravel-body w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 text-[#EDEAE2] placeholder-[#5B5F68] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="unravel-body w-full py-3.5 px-4 bg-[#E8A33D] hover:bg-[#F2AE4A] disabled:bg-[#2A2D35] disabled:text-[#5B5F68] text-[#0B0E14] font-semibold transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="unravel-body text-center text-[#8B8F98] text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E8A33D] hover:text-[#F2AE4A] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;