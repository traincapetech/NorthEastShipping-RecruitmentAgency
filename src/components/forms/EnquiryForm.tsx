'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TrainingProgram } from '@/types';
import { submitEnquiryAction, ActionResponse } from '@/actions/submissions';
import { CheckCircle2, Send, School, AlertCircle } from 'lucide-react';

interface EnquiryFormProps {
  program?: TrainingProgram;
}

export function EnquiryForm({ program }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '10th Standard',
    age: '18',
    cityState: '',
    programCode: program ? program.code : 'GP-6M',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const response: ActionResponse = await submitEnquiryAction({
        programId: program?.id,
        programTitle: program ? `${program.title} (${program.code})` : 'Offline Maritime Academy Admissions',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        highestQualification: formData.qualification,
        age: parseInt(formData.age, 10) || 18,
        cityState: formData.cityState,
        message: formData.notes
      });

      if (response.success && response.trackingId) {
        setTrackingId(response.trackingId);
        setSubmitted(true);
      } else {
        setFormError(response.message || 'Unable to submit enquiry.');
        if (response.errors) {
          setFieldErrors(response.errors);
        }
      }
    } catch {
      setFormError('A network error occurred while submitting your enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setTrackingId('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      qualification: '10th Standard',
      age: '18',
      cityState: '',
      programCode: program ? program.code : 'GP-6M',
      notes: ''
    });
  };

  if (submitted) {
    return (
      <Card glow className="p-8 text-center bg-navy-900 border-cyan-500/40">
        <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Admission Enquiry Submitted</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          Thank you for your interest in our offline academy programs. Our admissions counselor will contact you via phone/WhatsApp to discuss offline batch dates, medical requirements, and hostel facilities.
        </p>
        <div className="p-3 bg-navy-950 rounded-lg text-xs text-slate-400 border border-slate-800 mb-6">
          Official Tracking ID: <span className="font-mono text-cyan-400 font-bold">{trackingId}</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-cyan-400 hover:underline cursor-pointer"
        >
          Submit another admission enquiry
        </button>
      </Card>
    );
  }

  return (
    <Card glow className="p-6 sm:p-8 bg-navy-900/90 border-cyan-500/30">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <School className="w-4 h-4" />
          <span>Offline Academy Admissions</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          {program ? `Enquire for ${program.title}` : 'Maritime Training Enquiry'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Receive official guidance on batch commencement, campus admission criteria, and medical screening.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Candidate Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Ankit Barua"
            className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
              fieldErrors.fullName ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-cyan-400'
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-[11px] text-red-400 mt-1">{fieldErrors.fullName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="candidate@gmail.com"
              className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                fieldErrors.email ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Mobile / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                fieldErrors.phone ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Highest Qualification *
            </label>
            <select
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="10th Standard">10th Standard (GP Rating)</option>
              <option value="12th PCM">12th Science PCM (DNS/Deck Cadet)</option>
              <option value="Diploma/BE Electrical">Diploma / Degree in Electrical (ETO)</option>
              <option value="Hotel Management">Diploma / Degree in Hotel Mgmt</option>
              <option value="Other">Other Higher Secondary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Age (Years) *
            </label>
            <input
              type="number"
              min={17}
              max={35}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white focus:outline-none ${
                fieldErrors.age ? 'border-red-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.age && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              City & State of Residence
            </label>
            <input
              type="text"
              required
              value={formData.cityState}
              onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
              placeholder="e.g. Guwahati, Assam"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Questions / Batch Preference
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Ask about hostel accommodation, upcoming batch dates, or medical eligibility..."
            className="w-full px-3.5 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          variant="cyan"
          size="lg"
          className="w-full"
          isLoading={loading}
          icon={<Send className="w-4 h-4" />}
        >
          Submit Admission Enquiry
        </Button>
      </form>
    </Card>
  );
}
