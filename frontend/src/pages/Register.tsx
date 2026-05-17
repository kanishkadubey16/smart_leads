import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/FormField';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'SALES_USER']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { registerUser, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'SALES_USER',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values.name, values.email, values.password, values.role);
      navigate('/');
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-8 sm:p-10 flex flex-col">
        
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 text-white mx-auto mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Join Smart Leads and start managing your pipeline
          </p>
        </div>

        {/* Error Alert UI */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-600 flex justify-between items-center animate-fadeIn">
            <span>{error}</span>
            <button 
              onClick={clearError} 
              className="text-red-400 hover:text-red-600 font-bold ml-2 text-sm transition-colors"
            >
              &times;
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            label="Full name"
            placeholder="John Doe"
            registration={register('name')}
            error={errors.name?.message}
          />

          <FormField
            label="Email address"
            placeholder="kd@gmail.com"
            type="email"
            registration={register('email')}
            error={errors.email?.message}
          />

          <FormField
            label="Password"
            placeholder="••••••"
            type="password"
            registration={register('password')}
            error={errors.password?.message}
          />

          <FormField
            label="Role"
            registration={register('role')}
            error={errors.role?.message}
            options={[
              { value: 'SALES_USER', label: 'Sales User' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-200 text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        {/* Switch to Login Link */}
        <div className="text-center mt-8 text-xs font-medium text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            onClick={clearError}
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
