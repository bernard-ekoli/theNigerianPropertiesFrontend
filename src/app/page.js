"use client"
import React, { useState, useEffect } from "react";
import "../styles/page.css"
import formatCustomCurrency from "../../tools/formatCurrency";
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [userExists, setUserExists] = useState(false);
  const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
      <path d="M12 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z" />
      <path d="M12 21.7L4.5 15.5a9 9 0 0 1 15 0z" />
    </svg>
  );

  const BedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed">
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 1 1 0 4H2" />
      <path d="M2 12h18a2 2 0 1 1 0 4H2" />
      <path d="M22 12v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8" />
      <line x1="12" x2="12" y1="12" y2="16" />
    </svg>
  );

  const BathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath">
      <path d="M9 16.5a.5.5 0 0 1 .5-.5c.2 0 .4.1.6.2l.5.8c.2.3.5.5.8.5a.5.5 0 0 0 .5-.5c0-.2-.1-.4-.2-.6l-.8-.5c-.3-.2-.5-.5-.5-.8a.5.5 0 0 0-.5-.5c-.2 0-.4.1-.6.2l-.5.8c-.3.3-.5.5-.8.5a.5.5 0 0 0-.5-.5" />
      <path d="M10 20v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2h4z" />
      <path d="M18 20v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2h4z" />
      <path d="M21 2h-18a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
    </svg>
  );

  const SquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square">
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M6 14v-2a4 4 0 0 1 3-3.87" />
    </svg>
  );

  const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.46 13.22L18 20l-4.5-1.5L12 20l-1.5-1.5L6 20l2.54-6.78" />
    </svg>
  );
  const HamburgerMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
  )
  const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
  )
  useEffect(() => {
    // Any necessary effect on component mount
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listing/`);
        const data = await response.json();
        console.log("THis is the data", data)
        setProperties(data.listings);
        console.log("Fetched properties:", data.listings);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`/api/users/`, {
          credentials: "include"
        })

        if (!res.ok) {
          console.log("User Not Found or not authenticated")
          setUserExists(false)
          return
        }

        setUserExists(true)

      } catch (error) {
        console.error("User fetch error:", error)
        setUserExists(false)
      }
    }

    fetchUserData()
  }, [])
  const popularLocations = [
    { name: "Lagos", detail: "Lekki, Ikoyi, Victoria Island", count: "2,400+ listings" },
    { name: "Abuja", detail: "Maitama, Wuse, Asokoro", count: "1,180+ listings" },
    { name: "Port Harcourt", detail: "GRA, Trans Amadi, Old GRA", count: "640+ listings" },
    { name: "Ibadan", detail: "Bodija, Akobo, Ring Road", count: "520+ listings" },
  ];

  const propertyCategories = [
    { title: "Homes for Sale", description: "Detached houses, terraces, duplexes, and luxury apartments.", href: "/properties?listingType=sale" },
    { title: "Rental Apartments", description: "Short-let, yearly rent, serviced apartments, and family homes.", href: "/properties?listingType=rent" },
    { title: "Land & Estates", description: "Verified plots, gated estates, and development land.", href: "/properties?propertyType=land" },
    { title: "Commercial Spaces", description: "Offices, shops, warehouses, and mixed-use buildings.", href: "/properties?propertyType=commercial" },
  ];

  const homeSteps = [
    { title: "Search your area", description: "Filter by city, budget, property type, and listing purpose." },
    { title: "Compare listings", description: "Review photos, prices, location details, and key amenities." },
    { title: "Contact safely", description: "Reach the listing owner or agent and schedule an inspection." },
  ];

  const featuredProperties = properties?.slice(0, 6) || [];
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-group">
              <a href="/">
                <video src="./logoTest.mp4" autoPlay loop muted className="logo-video">
                </video>
              </a>
            </div>
            <nav className="header-nav">
              <a href="/properties" className="nav-link">
                Properties
              </a>
              <a href="#footer" className="nav-link">
                About
              </a>
              <a href="#footer" className="nav-link">
                Contact
              </a>
            </nav>
            {userExists ? (
              <div className="header-actions">
                <a href="/dashboard" className="btn btn-outline">Dashboard</a>
              </div>) : (
              <div className="header-actions">
                <a href="/auth" className="btn btn-outline">Sign In</a>
                <a href="/auth" className="btn btn-green">Get Started</a>
              </div>
            )
            }
            <div className="header-hamburger" onClick={() => setIsOpen(true)}><HamburgerMenu /></div>
          </div>
        </div>
        <div className={`header-nav-mobile ${isOpen ? 'display-flex-column' : 'display-none'}`}>
          <div className="header-nav-mobile-head display-flex">
            <span className="h-n-m-h-head hundred">TheNigeriaProperties</span>
            <div className="h-n-m-h-content hundred" onClick={() => setIsOpen(false)}>
              <CancelIcon />
            </div>
          </div>
          <div className="header-nav-mobile-content display-flex-column">
            <a href="/properties" className="nav-link" onClick={() => setIsOpen(false)}>
              Properties
            </a>
            <a href="#footer" className="nav-link" onClick={() => setIsOpen(false)}>
              About
            </a>
            <a href="#footer" className="nav-link" onClick={() => setIsOpen(false)}>
              Contact
            </a>
          </div>
          <div className="header-actions-mobile display-flex-column">
            <a href="/auth" className="btn btn-outline">Sign In</a>
            <a href="/auth" className="btn btn-green">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker">Verified Nigerian property listings</span>
            <h1 className="hero-title">
              Find Your Perfect
              <span>Nigerian Home</span>
            </h1>
            <p className="hero-subtitle">
              Search homes, apartments, land, and commercial properties across Nigeria with clear prices,
              useful details, and faster ways to connect.
            </p>

            <div className="search-bar-card card">
              <div className="search-input-items display-flex">
                <div className="search-input-col display-flex-center">
                  <div className="display-flex-center searchInput">
                    <SearchIcon />
                    <input placeholder="Search by location, property type..." className="hundred" type="text" />
                  </div>
                </div>
                <div className="search-filter-group">
                  <select className="search-select">
                    <option>Property Type</option>
                    <option>House</option>
                    <option>Commercial</option>
                    <option>Land</option>
                  </select>
                </div>
              </div>
              <a href="/properties" className="btn btn-green search-btn hundredW">
                <SearchIcon />
                Search Properties
              </a>
            </div>

            <div className="popular-searches">
              <span>Popular:</span>
              <a href="/properties?location=Lagos">Lagos</a>
              <a href="/properties?location=Abuja">Abuja</a>
              <a href="/properties?propertyType=land">Land</a>
              <a href="/properties?listingType=rent">For Rent</a>
            </div>
          </div>

          <aside className="hero-market-card">
            <div className="market-card-top">
              <span>Live market snapshot</span>
              <strong>10,000+</strong>
              <small>properties listed nationwide</small>
            </div>
            <div className="market-list">
              {popularLocations.map((location) => (
                <a href={`/properties?location=${location.name}`} className="market-row" key={location.name}>
                  <div>
                    <strong>{location.name}</strong>
                    <span>{location.detail}</span>
                  </div>
                  <small>{location.count}</small>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-flex">
            <div className="stat-item">
              <div className="stat-icon-wrapper bg-green-100">
                <HomeIcon className="stat-icon" />
              </div>
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-description">Properties Listed</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper bg-emerald-100">
                <UsersIcon className="stat-icon stat-icon-emerald" />
              </div>
              <h3 className="stat-number">50,000+</h3>
              <p className="stat-description">Happy Customers</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper bg-teal-100">
                <TrendingUpIcon className="stat-icon stat-icon-teal" />
              </div>
              <h3 className="stat-number">₦500B+</h3>
              <p className="stat-description">Properties Sold</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper bg-lime-100">
                <AwardIcon className="stat-icon stat-icon-lime" />
              </div>
              <h3 className="stat-number">15+</h3>
              <p className="stat-description">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="container">
          <div className="section-header compact">
            <h2 className="section-title">Browse by Property Need</h2>
            <p className="section-subtitle">Give visitors more paths into the catalogue immediately.</p>
          </div>
          <div className="category-grid">
            {propertyCategories.map((category) => (
              <a href={category.href} className="category-card" key={category.title}>
                <span>{category.title}</span>
                <p>{category.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-properties-section">
        <div className="container">
          <div className="section-header section-header-row">
            <div>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle">Fresh homes, land, and commercial listings from across Nigeria.</p>
            </div>
            <a href="/properties" className="btn btn-outline">View All</a>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="property-flex">
              {featuredProperties.map((property) => (
                <div key={property._id} className="card property-card">
                  <a href={`/properties/${property._id}`}>
                    <div className="card-image-wrapper">
                      <img src={property.images[0]?.url} alt={property.title} className="card-image" />
                      <span className="badge card-badge sale">
                        {property.listingType === "sale" && "For Sale"}
                        {property.listingType === "rent" && "For Rent"}
                        {property.listingType === "lease" && "For Lease"}
                      </span>
                      {property.featured && (
                        <span className="badge card-badge featured">
                          <StarIcon />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="property-title">{property.title}</h3>
                        <span className="property-price">
                          {formatCustomCurrency("NGN", property.price, { listingType: property.listingType })}
                        </span>
                      </div>
                      <div className="property-location">
                        <MapPinIcon />
                        <span className="location-text">{property.address}</span>
                      </div>
                      <div className="property-details">
                        <div className="detail-item"><BedIcon /><span>{property.beds || 0} beds</span></div>
                        <div className="detail-item"><BathIcon /><span>{property.baths || 0} baths</span></div>
                        <div className="detail-item"><SquareIcon /><span>{property.sqft || "N/A"} sqft</span></div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="property-empty-state">
              <h3>Listings are loading</h3>
              <p>Visitors can still browse popular property types and locations while fresh listings appear.</p>
              <a href="/properties" className="btn btn-green">Browse All Properties</a>
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header compact">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">A simple path from search to inspection.</p>
          </div>
          <div className="steps-grid">
            {homeSteps.map((step, index) => (
              <div className="step-card" key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Dream Nigerian Home?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied customers who found their perfect property across Nigeria with us.
            </p>
            <div className="cta-actions">
              <a href="/properties" className="btn btn-secondary cta-btn btn-lg">
                Browse Properties
              </a>
              <a
                href="/auth"
                className="btn btn-transparent-white cta-btn btn-lg"
              >
                List Your Property
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-flex">
            <div>
              <div className="footer-brand-info">
                <img src="./LOGO.png" alt="TheNigeriaProperties Logo" className="footer-logo" />
              </div>
              <p className="footer-description">
                Your trusted partner in finding the perfect Nigerian property. We make real estate simple and accessible
                across Nigeria.
              </p>
            </div>
            <div>
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-link-list">
                <li>
                  <a href="/properties" className="footer-link">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="/about" className="footer-link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="footer-link">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/auth" className="footer-link">
                    Sign In
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="footer-heading">Services</h3>
              <ul className="footer-link-list">
                <li>Buy Properties</li>
                <li>Rent Properties</li>
                <li>Lease Properties</li>
                <li>Property Management</li>
              </ul>
            </div>
            <div>
              <h3 className="footer-heading">Contact Info</h3>
              <ul className="footer-link-list">
                <li><a href="mailto:info@thenigeriaproperties.com">info@thenigeriaproperties.com</a></li>
                <li> <a href="tel:+2341234567890">+234 (0) 123-456-7890</a> </li>
                <li> Victoria Island, Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 TheNigeriaProperties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}