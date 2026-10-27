'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RecruitmentOpportunity } from '@/types';
import { submitApplicationAction, ActionResponse } from '@/actions/submissions';
import { CheckCircle2, Send, ShieldCheck, AlertCircle } from 'lucide-react';

interface ApplicationFormProps {
  opportunity: RecruitmentOpportunity;
}

export function ApplicationForm({ opportunity }: ApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentRank: '',
    cdcNumber: '',
    passportNumber: '',
    totalSeaTime: '',
    vesselExperience: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const response: ActionResponse = await submitApplicationAction({
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        currentRank: formData.currentRank,
        cdcNumber: formData.cdcNumber,
        passportNumber: formData.passportNumber,
        totalSeaTime: formData.totalSeaTime,
        vesselExperience: formData.vesselExperience,
        additionalNotes: formData.notes
      });

      if (response.success && response.referenceId) {
        setReferenceId(response.referenceId);
        setSubmitted(true);
      } else {
        setFormError(response.message || 'Unable to submit application.');
        if (response.errors) {
          setFieldErrors(response.errors);
        }
      }
    } catch {
      setFormError('A network error occurred while submitting your dossier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceId('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      currentRank: '',
      cdcNumber: '',
      passportNumber: '',
      totalSeaTime: '',
      vesselExperience: '',
      notes: ''
    });
  };

  if (submitted) {
    return (
      <Card glow className="p-8 text-center bg-navy-900 border-cyan-500/40">
        <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Application Received</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          Your dossier for <strong>{opportunity.title}</strong> has been logged into our candidate registry. Our crewing desk will verify your maritime documents and contact you directly.
        </p>
        <div className="p-3 bg-navy-950 rounded-lg text-xs text-slate-400 border border-slate-800 mb-6">
          Official Dossier Reference ID: <span className="font-mono text-cyan-400 font-bold">{referenceId}</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-cyan-400 hover:underline cursor-pointer"
        >
          Submit another application or update details
        </button>
      </Card>
    );
  }

  return (
    <Card glow className="p-6 sm:p-8 bg-navy-900/90 border-cyan-500/30">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h3 className="text-xl font-bold text-white">Apply for this Position</h3>
        <p className="text-xs text-slate-400 mt-1">
          Submit your seafarer dossier for {opportunity.title}.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Legal Name (as per Passport) *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Captain Rajesh Sharma"
              className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                fieldErrors.fullName ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="applicant@seafarermail.com"
              className={`w-full px-3.5 py-2.5 bg-navy-950 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                fieldErrors.email ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Rank / Trade
            </label>
            <input
              type="text"
              value={formData.currentRank}
              onChange={(e) => setFormData({ ...formData, currentRank: e.target.value })}
              placeholder="e.g. 3rd Officer / F&B Steward"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Continuous Discharge Certificate (CDC) No.
            </label>
            <input
              type="text"
              value={formData.cdcNumber}
              onChange={(e) => setFormData({ ...formData, cdcNumber: e.target.value })}
              placeholder="e.g. MUM 123456 / International CDC"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Passport Number
            </label>
            <input
              type="text"
              value={formData.passportNumber}
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
              placeholder="Passport identification"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Documented Sea Time (in months)
            </label>
            <input
              type="text"
              value={formData.totalSeaTime}
              onChange={(e) => setFormData({ ...formData, totalSeaTime: e.target.value })}
              placeholder="e.g. 18 Months (or Fresher)"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Previous Vessel Types
            </label>
            <input
              type="text"
              value={formData.vesselExperience}
              onChange={(e) => setFormData({ ...formData, vesselExperience: e.target.value })}
              placeholder="e.g. Bulk Carrier, Container, Passenger"
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Additional Seafarer Notes & Certifications
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Mention STCW endorsements, CoC grade, or current availability date..."
            className="w-full px-3.5 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="p-3 rounded-lg bg-navy-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            By submitting, you certify that all entered maritime credentials, certificates, and medical history are genuine and subject to verification with issuing authorities.
          </span>
        </div>

        <Button
          type="submit"
          variant="cyan"
          size="lg"
          className="w-full"
          isLoading={loading}
          icon={<Send className="w-4 h-4" />}
        >
          Submit Candidacy Dossier
        </Button>
      </form>
    </Card>
  );
}
