'use client';

import React, { useState } from 'react';

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    registrationId: '',
    experienceRating: '5',
    speakerRating: '5',
    comments: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      setError('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', marginTop: '10vh' }}>
        <div className="glass-card animate-fade-in">
          <div style={{ fontSize: '4rem', color: 'var(--success)', lineHeight: '1' }}>✓</div>
          <h1 style={{ marginTop: '1rem', color: 'var(--success)' }}>Thank You!</h1>
          <p>Your feedback has been successfully submitted. We appreciate your input to make Inspire Summit even better next year.</p>
          <a href="/" className="btn mt-4">Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="glass-card animate-fade-in" style={{ marginTop: '2rem' }}>
        <h1 className="text-center mb-4">Post-Event Feedback</h1>
        <p className="text-center mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
          We hope you enjoyed Inspire Summit 2026. Please share your experience!
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col">
          <label className="label">Registration ID * (Found on your ticket)</label>
          <input required type="text" name="registrationId" value={formData.registrationId} onChange={handleInputChange} className="input" placeholder="e.g. INSP26-1234" />
          
          <label className="label">Overall Experience Rating (1-5) *</label>
          <select required name="experienceRating" value={formData.experienceRating} onChange={handleInputChange} className="input">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>

          <label className="label">Speakers & Sessions Rating (1-5) *</label>
          <select required name="speakerRating" value={formData.speakerRating} onChange={handleInputChange} className="input">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>

          <label className="label">Any suggestions for next year?</label>
          <textarea name="comments" value={formData.comments} onChange={handleInputChange} className="input" rows={4} style={{ resize: 'vertical' }}></textarea>

          <button type="submit" className="btn w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
