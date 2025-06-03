import React, { useState } from 'react';

// Since we can't import MUI directly, we'll create a comprehensive MUI-style component
// that would work with Material-UI when properly imported

const HealthHubPharmacy = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Pain Relief', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
    { name: 'Antibiotics', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop' },
    { name: 'Vitamins', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop' },
    { name: 'Digestive Health', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd0eba8?w=300&h=300&fit=crop' },
    { name: 'Respiratory Care', image: 'https://images.unsplash.com/photo-1559757146-338c0af19d27?w=300&h=300&fit=crop' },
  ];

  const featuredSections = [
    { 
      title: 'Top Medicines', 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Most popular and trusted medicines'
    },
    { 
      title: 'Featured Products', 
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      description: 'Curated selection of quality products'
    },
    { 
      title: 'Special Offers', 
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop',
      description: 'Limited time deals and discounts'
    },
  ];

  // MUI-style component structure
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafafa',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* AppBar equivalent */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px'
        }}>
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#1976d2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              🏥
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 500,
              margin: 0,
              color: 'rgba(0, 0, 0, 0.87)'
            }}>
              HealthHub Pharmacy
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{ 
            display: window.innerWidth >= 768 ? 'flex' : 'none',
            gap: '32px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'rgba(0, 0, 0, 0.87)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.04)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            >
              Home
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'rgba(0, 0, 0, 0.87)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.04)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            >
              Medicines
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'rgba(0, 0, 0, 0.87)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.04)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            >
              Contact
            </button>
          </nav>

          {/* Search and Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: window.innerWidth >= 600 ? 'flex' : 'none',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Search"
                style={{
                  padding: '8px 12px 8px 40px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#f5f5f5'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                  e.target.style.backgroundColor = '#f5f5f5';
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(0, 0, 0, 0.54)'
              }}>
                🔍
              </span>
            </div>
            
            <button style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1565c0';
              (e.target as HTMLElement).style.boxShadow = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = 'transparent';
              target.style.boxShadow = 'none';
            }}
            >
              Login/Register
            </button>
          </div>
        </div>
      </header>

      {/* Container equivalent */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Paper - Main Search */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for medicines"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f5f5f5'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1976d2';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                e.target.style.backgroundColor = '#f5f5f5';
              }}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#1976d2',
              fontSize: '20px'
            }}>
              🔍
            </span>
          </div>
        </div>

        {/* Grid - Featured Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {featuredSections.map((section, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <img
                src={section.image}
                alt={section.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  margin: '0 0 8px 0',
                  color: 'rgba(0, 0, 0, 0.87)'
                }}>
                  {section.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.6)',
                  margin: 0,
                  lineHeight: '1.43'
                }}>
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Typography - Section Title */}
        <h2 style={{
          fontSize: '2.125rem',
          fontWeight: 400,
          margin: '0 0 32px 0',
          color: 'rgba(0, 0, 0, 0.87)',
          letterSpacing: '0.00735em'
        }}>
          Medicine Categories
        </h2>

        {/* Grid - Categories */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '12px', textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.87)'
                }}>
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <h2 style={{
          fontSize: '2.125rem',
          fontWeight: 400,
          margin: '0 0 32px 0',
          color: 'rgba(0, 0, 0, 0.87)',
          letterSpacing: '0.00735em'
        }}>
          Our Services
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
          {[
            { icon: '💬', label: 'Online Consultations', color: '#e3f2fd' },
            { icon: '📤', label: 'Prescription Upload', color: '#e8f5e8' },
            { icon: '🚛', label: 'Delivery Options', color: '#f3e5f5' }
          ].map((service, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: service.color,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid transparent'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1976d2';
                (e.target as HTMLElement).style.color = 'white';
                (e.target as HTMLElement).style.boxShadow = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = service.color;
                e.currentTarget.style.color = 'rgba(0, 0, 0, 0.87)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '16px' }}>{service.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{service.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        marginTop: '64px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <a href="#" style={{
              color: 'rgba(0, 0, 0, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.color = '#1976d2'}
            onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(0, 0, 0, 0.6)'}
            >
              About Us
            </a>
            <a href="#" style={{
              color: 'rgba(0, 0, 0, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.color = '#1976d2'}
            onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(0, 0, 0, 0.6)'}
            >
              Help Center
            </a>
            <a href="#" style={{
              color: 'rgba(0, 0, 0, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.color = '#1976d2'}
            onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(0, 0, 0, 0.6)'}
            >
              Terms of Service
            </a>
          </div>

          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            margin: '32px 0'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {['🐦', '📘', '📷'].map((icon, index) => (
              <button
                key={index}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e3f2fd',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '20px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#1976d2';
                  (e.target as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#e3f2fd';
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <p style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: '14px',
            margin: 0
          }}>
            © 2024 HealthHub Pharmacy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HealthHubPharmacy;