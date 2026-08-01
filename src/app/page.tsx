"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [formData, setFormData] = useState({
    primaryName: "",
    primaryEmail: "",
    primaryPhone: "",
    businessStage: "",
    prayerRequested: false,
  });
  const [guests, setGuests] = useState<{ name: string; email: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const addGuest = () => {
    setGuests([...guests, { name: "", email: "" }]);
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const removeGuest = (index: number) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, guests }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessData(data.group);
        // Construct full URL for QR code
        const origin = window.location.origin;
        setQrUrl(`${origin}${data.group.masterQrCode}`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <main className="container flex flex-col items-center justify-center min-h-screen text-center">
        <div className="glass-card animate-fade-in flex flex-col items-center">
          <h1 className="mb-4">Registration Successful!</h1>
          <p className="mb-6 text-lg">Thank you, {successData.groupName}. Your group is registered.</p>
          
          <div className="mb-6 p-4 bg-white rounded-xl">
            <QRCodeSVG value={qrUrl} size={200} />
          </div>
          
          <p className="mb-4 text-sm text-[rgba(255,255,255,0.7)]">
            Please save this QR code. You will need it for check-in at the event.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-secondary mt-4"
          >
            Register Another Group
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container flex items-center justify-center min-h-screen py-10">
      <div className="glass-card w-full max-w-2xl animate-fade-in">
        <h1 className="text-center mb-6">Summit Registration</h1>
        <form onSubmit={handleSubmit}>
          
          {/* Primary Registrant Info */}
          <div className="mb-8">
            <h3 className="mb-4" style={{ color: "var(--accent)" }}>Primary Attendee</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">Full Name</label>
                <input 
                  type="text" 
                  name="primaryName" 
                  required 
                  className="input" 
                  value={formData.primaryName} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input 
                  type="email" 
                  name="primaryEmail" 
                  required 
                  className="input" 
                  value={formData.primaryEmail} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="label">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  name="primaryPhone" 
                  className="input" 
                  value={formData.primaryPhone} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="label">Business Stage</label>
                <select 
                  name="businessStage" 
                  className="input" 
                  value={formData.businessStage} 
                  onChange={handleInputChange}
                >
                  <option value="">Select a stage...</option>
                  <option value="Idea">Idea / Concept</option>
                  <option value="Startup">Startup</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="prayerRequested" 
                  checked={formData.prayerRequested} 
                  onChange={handleInputChange} 
                  style={{ width: "20px", height: "20px" }}
                />
                <span className="text-sm">Would you like someone from our team to pray with you?</span>
              </label>
            </div>
          </div>

          {/* Guest Registration */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ color: "var(--secondary)" }}>Guests</h3>
              <button type="button" onClick={addGuest} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                + Add Guest
              </button>
            </div>
            
            {guests.length === 0 ? (
              <p className="text-sm text-[rgba(255,255,255,0.5)]">No guests added yet. Click above to bring a guest.</p>
            ) : (
              guests.map((guest, index) => (
                <div key={index} className="flex gap-4 items-center mb-4 p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex-1">
                    <label className="label text-xs">Guest Name</label>
                    <input 
                      type="text" 
                      required 
                      className="input" 
                      style={{ marginBottom: 0 }}
                      value={guest.name} 
                      onChange={(e) => updateGuest(index, "name", e.target.value)} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="label text-xs">Guest Email</label>
                    <input 
                      type="email" 
                      required 
                      className="input"
                      style={{ marginBottom: 0 }}
                      value={guest.email} 
                      onChange={(e) => updateGuest(index, "email", e.target.value)} 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeGuest(index)} 
                    className="btn" 
                    style={{ background: "var(--danger)", padding: "0.8rem", marginTop: "1.2rem" }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <button type="submit" className="btn" style={{ width: "100%", padding: "1rem", fontSize: "1.2rem" }} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
