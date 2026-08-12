import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://unravel-bm4y.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
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
              Create account
            </h1>
            <p className="unravel-body text-[#8B8F98] text-sm">Join us and start exploring</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-[#E8352B]/10 border border-[#E8352B]/30">
              <p className="unravel-body text-[#F0897F] text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="unravel-mono block text-[11px] text-[#8B8F98] tracking-[0.1em] mb-2">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john_doe"
                className="unravel-input unravel-body w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 text-[#EDEAE2] placeholder-[#5B5F68] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="unravel-mono block text-[11px] text-[#8B8F98] tracking-[0.1em] mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="unravel-input unravel-body w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 text-[#EDEAE2] placeholder-[#5B5F68] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="unravel-mono block text-[11px] text-[#8B8F98] tracking-[0.1em] mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="unravel-input unravel-body w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 text-[#EDEAE2] placeholder-[#5B5F68] focus:outline-none transition-colors"
              />
            </div>

            <div className="unravel-body text-xs text-[#8B8F98] space-y-1">
              <p>· Password must be at least 6 characters long</p>
              <p>· Username must be at least 3 characters long</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="unravel-body w-full py-3.5 px-4 bg-[#E8A33D] hover:bg-[#F2AE4A] disabled:bg-[#2A2D35] disabled:text-[#5B5F68] text-[#0B0E14] font-semibold transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-white/10" />
            <span className="unravel-mono text-[10px] text-[#5B5F68] tracking-[0.1em]">OR</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <p className="unravel-body text-center text-[#8B8F98] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E8A33D] hover:text-[#F2AE4A] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;