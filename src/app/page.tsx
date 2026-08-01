import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const speakers = [
    { 
      name: "DR. EEZEE TEE", 
      title: "CEO, EEZEE CONCEPTZ GLOBAL", 
      image: "/speakers/speaker-1.jpeg" 
    },
    { 
      name: "DR. BAYO ADEDEJI", 
      title: "CEO OF WAKANOW", 
      image: "/speakers/speaker-2.png" 
    },
    { 
      name: "MR. GBOLAHAN FANIRAN", 
      title: "CEO, MINIEMONEY", 
      image: "/speakers/speaker-3.jpeg" 
    },
    { 
      name: "MR. TOBI FLETCHER", 
      title: "CEO OF OFADABOY", 
      image: "/speakers/speaker-4.jpeg" 
    },
  ];

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <header className="text-center animate-fade-in" style={{ marginTop: '6vh', marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--foreground)' }}>
          INSPIRE SUMMIT 2026 PRESENTS:
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
          BUSINESS LEADERSHIP SUMMIT
        </h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.2em', margin: '1.5rem 0', color: 'var(--foreground)' }}>
          THEME:
        </div>
        <h1 style={{ 
          fontSize: '7rem', 
          lineHeight: '1',
          marginBottom: '2rem', 
          background: 'linear-gradient(to right, var(--secondary) 50%, var(--accent) 50%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          fontWeight: 900,
          fontFamily: 'Impact, sans-serif'
        }}>
          THRIVE
        </h1>
        
        <div className="flex justify-center gap-4 mt-4 mb-8">
          <Link href="/register" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>
            Register Now
          </Link>
          <Link href="#speakers" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>
            View Speakers
          </Link>
        </div>
      </header>

      {/* Guest Speakers */}
      <section id="speakers" className="animate-fade-in" style={{ marginBottom: '4rem', animationDelay: '0.2s' }}>
        <h2 className="text-center" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem' }}>
          <span style={{ borderBottom: '2px solid var(--secondary)', padding: '0 1rem' }}>Guest Speakers</span>
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {speakers.map((speaker, index) => (
            <div key={index} className="speaker-card">
              <div className="speaker-image" style={{ position: 'relative' }}>
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }} 
                />
              </div>
              <div className="speaker-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>{speaker.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {speaker.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Details Footer Banner */}
      <section className="animate-fade-in" style={{ animationDelay: '0.4s', background: 'var(--secondary)', color: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 300px', borderLeft: '4px solid white', paddingLeft: '1.5rem' }}>
          <div style={{ border: '1px solid white', display: 'inline-block', padding: '0.2rem 1rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.8rem', letterSpacing: '1px' }}>DATE</div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.2rem' }}>SAT., AUG. 29TH, 2026</h2>
        </div>
        
        <div style={{ flex: '0 1 auto', borderLeft: '4px solid white', paddingLeft: '1.5rem' }}>
          <div style={{ border: '1px solid white', display: 'inline-block', padding: '0.2rem 1rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.8rem', letterSpacing: '1px' }}>TIME</div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '3rem' }}>9AM</h2>
        </div>

        <div style={{ flex: '1 1 400px', borderLeft: '4px solid white', paddingLeft: '1.5rem' }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem', lineHeight: '1.4' }}>
            FOTA AUDITORIUM,<br/>
            40/42 Imam Dauda Street,<br/>
            Off Eric Moore Road, Surulere, Lagos.
          </h3>
        </div>
      </section>

      <footer style={{ marginTop: '4rem', padding: '2rem 0', textAlign: 'center', color: 'var(--secondary)' }}>
        <p>&copy; 2026 Inspire Summit. All Rights Reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm font-semibold">
          <Link href="/admin">Admin Dashboard</Link>
          <span>|</span>
          <Link href="/checkin">Volunteer Check-in</Link>
        </div>
      </footer>
    </div>
  );
}
