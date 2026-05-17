import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2 } from 'lucide-react';
import type { Lead } from '../types';
import FormField from './FormField';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Lost'] as const),
  source: z.enum(['Email Campaign', 'Cold Call', 'LinkedIn', 'Referral', 'Website'] as const),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  lead?: Lead | null; // If editing
  loading: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  loading,
}) => {
  const isEdit = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  // Reset form when modal opens or lead changes
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        });
      } else {
        reset({
          name: '',
          email: '',
          status: 'New',
          source: 'Website',
        });
      }
    }
  }, [isOpen, lead, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[500px] bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-950/20 p-6 sm:p-8 flex flex-col animate-scaleIn z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isEdit ? 'Edit Lead' : 'Add Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors duration-150 outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            label="Full Name"
            placeholder="John Doe"
            registration={register('name')}
            error={errors.name?.message}
          />

          <FormField
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            registration={register('email')}
            error={errors.email?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Status"
              registration={register('status')}
              error={errors.status?.message}
              options={[
                { value: 'New', label: 'New' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Lost', label: 'Lost' },
              ]}
            />

            <FormField
              label="Source"
              registration={register('source')}
              error={errors.source?.message}
              options={[
                { value: 'Email Campaign', label: 'Email Campaign' },
                { value: 'Cold Call', label: 'Cold Call' },
                { value: 'LinkedIn', label: 'LinkedIn' },
                { value: 'Referral', label: 'Referral' },
                { value: 'Website', label: 'Website' },
              ]}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 text-xs flex items-center gap-2 cursor-pointer transition-all duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Add Lead'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LeadModal;
