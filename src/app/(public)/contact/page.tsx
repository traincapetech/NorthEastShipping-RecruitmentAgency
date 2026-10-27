'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Recruitment Opening',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-14 relative">
        <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Communication Desk</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Contact Northeast Shipping
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Get in touch with our recruitment officers, academy admissions counselors, or corporate shipowner relations desk.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Registered Headquarters</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official offices for candidate document verification, interview sessions, and offline training admissions.
              </p>
            </div>

            <Card className="p-6 bg-navy-900/70 border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Registered Maritime Office</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Northeast Shipping & Recruitment Agency Pvt Ltd<br />
                    Shangchipem Arcade, 2nd floor, opposite UBC <br />Phungreitang East Ukhrul Manipur India 795142
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Telephone Inquiries</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct Official Desk: +91 90047 65724
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Direct Email Inboxes</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Recruitment: Northeastshippingrecruitmentag@gmail.com<br />
                    Admissions: Northeastshippingrecruitmentag@gmail.com<br />
                    General: Northeastshippingrecruitmentag@gmail.com
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Operating Hours</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Monday to Saturday: 09:30 AM – 06:00 PM IST<br />
                    Sunday & Maritime Holidays: Closed
                  </p>
                </div>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300/90 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Document Verification Appointments: Walk-in seafarer document verification is scheduled between 10:00 AM and 04:00 PM on weekdays.
              </span>
            </div>
          </div>

          {/* Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <Card glow className="p-8 text-center bg-navy-900 border-cyan-500/40">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Transmitted</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                  Thank you for reaching out. Your communication has been dispatched to the appropriate department. Our team will respond within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Send another inquiry
                </button>
              </Card>
            ) : (
              <Card glow className="p-6 sm:p-8 bg-navy-900/90 border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-1">Send an Official Enquiry</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Fill in your details below and our coordination team will get back to you promptly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Captain / Cadet Name"
                        className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Telephone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Enquiry Nature
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Recruitment Opening">Seafarer Recruitment Application</option>
                        <option value="Training Admission">Offline Maritime Academy Admission</option>
                        <option value="Cruise Hospitality">Cruise Ship Hospitality Opportunity</option>
                        <option value="Shipowner Crewing">Shipowner Fleet Manning Collaboration</option>
                        <option value="General">Other Official Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your inquiry, current rank, or training program question..."
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
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
                    Transmit Message
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
