'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    gender: '',
    ageGroup: '',
    phone: '',
    email: '',
    location: '',
    attendingAs: '',
    company: '',
    jobTitle: '',
    industry: '',
    experienceYears: '',
    source: '',
    expectations: '',
    communicationConsent: false,
    mediaRelease: false,
    conductAgreement: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Type guard for HTMLInputElement
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4) {
      nextStep();
      return;
    }

    if (!formData.communicationConsent || !formData.mediaRelease || !formData.conductAgreement) {
      setError('Please agree to all mandatory consents.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/ticket/${data.id}`);
      } else {
        setError(data.error || 'Failed to register. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="glass-card animate-fade-in" style={{ marginTop: '2rem' }}>
        <h1 className="text-center mb-4">Inspire Summit 2026</h1>
        <p className="text-center mb-4" style={{ color: 'var(--accent)' }}>
          Step {step} of 4
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2>Personal Information</h2>
              
              <label className="label">Full Name *</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="input" placeholder="John Doe" />
              
              <label className="label">Preferred Name</label>
              <input type="text" name="preferredName" value={formData.preferredName} onChange={handleInputChange} className="input" placeholder="John" />
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">Gender *</label>
                  <select required name="gender" value={formData.gender} onChange={handleInputChange} className="input">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="label">Age Group *</label>
                  <select required name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="input">
                    <option value="">Select Age Group</option>
                    <option value="16-18">16–18</option>
                    <option value="19-24">19–24</option>
                    <option value="25-34">25–34</option>
                    <option value="35-44">35–44</option>
                    <option value="45-54">45–54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input" />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" />
                </div>
              </div>

              <label className="label">City/State/Country *</label>
              <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="input" placeholder="Lagos, Nigeria" />
            </div>
          )}

          {/* Step 2: Professional Profile */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2>Professional Profile</h2>
              
              <label className="label">Attending As *</label>
              <select required name="attendingAs" value={formData.attendingAs} onChange={handleInputChange} className="input">
                <option value="">Select Category</option>
                <option value="Marketing Professional">Marketing Professional</option>
                <option value="Professional">Professional</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Leader/Minister">Leader/Minister</option>
                <option value="Speaker">Speaker</option>
                <option value="Sponsor/Partner">Sponsor/Partner</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>

              <label className="label">Company / Organisation Name</label>
              <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="input" />

              <label className="label">Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="input" />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">Industry</label>
                  <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="input" />
                </div>
                <div>
                  <label className="label">Years of Experience</label>
                  <select name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} className="input">
                    <option value="">Select...</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Discovery */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2>Event Discovery & Expectations</h2>
              
              <label className="label">How did you hear about Inspire Summit? *</label>
              <select required name="source" value={formData.source} onChange={handleInputChange} className="input">
                <option value="">Select Source</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend/Colleague">Friend/Colleague</option>
                <option value="Church/Community">Church/Community</option>
                <option value="School/Organisation">School/Organisation</option>
                <option value="Website">Website</option>
                <option value="Google Search">Google Search</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>

              <label className="label">What do you hope to gain from Inspire Summit?</label>
              <textarea 
                name="expectations" 
                value={formData.expectations} 
                onChange={handleInputChange} 
                className="input" 
                rows={4}
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          )}

          {/* Step 4: Consents */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2>Consent & Compliance</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="communicationConsent" checked={formData.communicationConsent} onChange={handleInputChange} style={{ marginTop: '5px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    I agree to receive event updates and future communications.
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="mediaRelease" checked={formData.mediaRelease} onChange={handleInputChange} style={{ marginTop: '5px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    I grant permission for photographs, videos, and recordings captured during the summit to be used for Inspire Summit publicity.
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="conductAgreement" checked={formData.conductAgreement} onChange={handleInputChange} style={{ marginTop: '5px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    I agree to follow event guidelines and the code of conduct.
                  </span>
                </label>

              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="btn btn-secondary">Back</button>
            ) : <div></div>}
            
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : (step === 4 ? 'Complete Registration' : 'Continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
