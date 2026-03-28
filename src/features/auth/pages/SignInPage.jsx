import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../AuthContext';

const INITIAL_FORM = {
  username: '',
  password: '',
};

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, signInWithDemo } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.username.trim()) && Boolean(form.password.trim()) && !isSubmitting,
    [form.password, form.username, isSubmitting]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await signIn({
        username: form.username.trim(),
        password: form.password,
      });
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError?.data?.message || submitError.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsCreatingDemo(true);
    setError('');

    try {
      await signInWithDemo();
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError?.data?.message || submitError.message || 'Unable to create demo account');
    } finally {
      setIsCreatingDemo(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up where you left off, or open a fresh demo workspace if you just want to look around."
      footer={
        <>
          Need an account?{' '}
          <Link className="font-semibold text-teal-700 transition hover:text-teal-800" to="/signup">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            name="username"
            placeholder="What do you sign in with?"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            type="password"
            name="password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <button
          className="w-full rounded-2xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canSubmit}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="relative py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span className="bg-transparent px-4">or</span>
      </div>

      <button
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-teal-200 hover:bg-teal-50"
        type="button"
        onClick={handleDemoLogin}
        disabled={isCreatingDemo}
      >
        {isCreatingDemo ? 'Building your demo workspace...' : 'Try a demo first'}
      </button>
    </AuthShell>
  );
}
