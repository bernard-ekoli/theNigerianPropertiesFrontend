"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import "../../../styles/id.css"

// Replaced imported components with simple JSX to reduce dependencies
const Button = ({ onClick, className, children, type }) => (
  <button onClick={onClick} className={className} type={type}>{children}</button>
)

const Card = ({ children }) => <div className="card-container">{children}</div>

const CardContent = ({ children }) => <div className="card-content">{children}</div>

const CardHeader = ({ children }) => <div className="card-header-inner">{children}</div>

const CardTitle = ({ children }) => <h2 className="card-title-inner">{children}</h2>

const Badge = ({ className, children }) => <span className={className}>{children}</span>

const Input = ({ placeholder, value, onChange, type, required }) => (
  <input placeholder={placeholder} value={value} onChange={onChange} type={type} required={required} className="input" />
)

const Label = ({ children }) => <label className="label">{children}</label>

const Textarea = ({ placeholder, value, onChange, required }) => (
  <textarea placeholder={placeholder} value={value} onChange={onChange} required={required} className="textarea" />
)

// Icon components (simplified SVGs)
const ArrowLeft = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const MapPin = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Bed = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M80-200v-240q0-27 11-49t29-39v-112q0-50 35-85t85-35h160q23 0 43 8.5t37 23.5q17-15 37-23.5t43-8.5h160q50 0 85 35t35 85v112q18 17 29 39t11 49v240h-80v-80H160v80H80Zm440-360h240v-80q0-17-11.5-28.5T720-680H560q-17 0-28.5 11.5T520-640v80Zm-320 0h240v-80q0-17-11.5-28.5T400-680H240q-17 0-28.5 11.5T200-640v80Zm-40 200h640v-80q0-17-11.5-28.5T760-480H200q-17 0-28.5 11.5T160-440v80Z" />
  </svg>
);

const Bath = () => (
<svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M360-240q17 0 28.5-11.5T400-280q0-17-11.5-28.5T360-320q-17 0-28.5 11.5T320-280q0 17 11.5 28.5T360-240Zm120 0q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm120 0q17 0 28.5-11.5T640-280q0-17-11.5-28.5T600-320q-17 0-28.5 11.5T560-280q0 17 11.5 28.5T600-240ZM360-360q17 0 28.5-11.5T400-400q0-17-11.5-28.5T360-440q-17 0-28.5 11.5T320-400q0 17 11.5 28.5T360-360Zm120 0q17 0 28.5-11.5T520-400q0-17-11.5-28.5T480-440q-17 0-28.5 11.5T440-400q0 17 11.5 28.5T480-360Zm120 0q17 0 28.5-11.5T640-400q0-17-11.5-28.5T600-440q-17 0-28.5 11.5T560-400q0 17 11.5 28.5T600-360ZM280-480h400v-40q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520v40Zm62-60q8-51 46.5-85.5T480-660q53 0 91.5 34.5T618-540H342ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/></svg>
);

const Square = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

const Calendar = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const Eye = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MessageSquare = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Phone = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z" />
  </svg>
);

const Mail = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const User = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Home = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Heart = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const Share2 = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.42" />
    <path d="m15.41 6.49-6.83 3.42" />
  </svg>
);

const ChevronLeft = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg className="icon-grey" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);


// Dummy authService
const authService = {
  getCurrentUser: () => ({ id: "user-1", name: "John Doe" }),
  getAdById: (id) => {
    const properties = [
      {
        id: "1", title: "Luxury 5-Bedroom Villa", address: "Lekki, Lagos", price: 250000000, listingType: "sale", type: "house", beds: 5, baths: 6, sqft: 5000, description: "A stunning villa with a swimming pool and modern amenities, located in a secure gated community.", images: ["https://picsum.photos/600/400?random=1", "https://picsum.photos/600/400?random=2"], featured: true, createdAt: "2024-01-15T08:00:00Z", views: 1250, inquiries: 45
      },
      {
        id: "2", title: "Spacious 3-Bedroom Apartment", address: "Wuse 2, Abuja", price: 5000000, listingType: "rent", type: "condo", beds: 3, baths: 3, sqft: 2500, description: "Conveniently located in a secure and serene neighborhood. The apartment features a spacious living area and a well-equipped kitchen.", images: ["https://picsum.photos/600/400?random=3", "https://picsum.photos/600/400?random=4"], featured: false, createdAt: "2024-02-20T10:30:00Z", views: 800, inquiries: 20
      },
    ];
    return properties.find(p => p.id === id);
  },
  incrementViews: (id) => {
    console.log(`Incremented views for property ${id}`);
  },
  incrementInquiries: (id) => {
    console.log(`Incremented inquiries for property ${id}`);
  },
};
function shareContent() {
  if (navigator.share) { // check if browser supports it
    navigator.share({
      title: 'Check out this property!',
      text: 'I found this amazing property on TheNigeriaProperties.',
      url: window.location.href,
    })
      .then(() => console.log('Content shared successfully'))
      .catch((error) => console.log('Error sharing:', error));
  } else {
    alert('Sharing not supported on this browser');
  }
}


export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [agentInfo, setAgentInfo] = useState(null)
  useEffect(() => {
    if (!params.id) {
      router.push("/properties")
      return
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProperty(data.listing);
        authService.incrementViews(params.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    const fetchAgentID = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch agent ID");
        const data = await res.json();
        console.log("Agent ID:", data.listing.userId);
        const agentinfores = await fetch(`/api/get-public-user-details?agentId=${data.listing.userId}`);
        if (!agentinfores.ok) throw new Error("Failed to fetch agent info");
        const agentData = await agentinfores.json();
        console.log("Agent Info:", agentData);
        setAgentInfo(agentData);
      } catch (error) {
        console.error("Error fetching agent ID:", error);
      }
    }
    fetchAgentID();
  }, [params.id])

  const formatPrice = (price, listingType) => {
    const formatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    if (listingType === "rent" || listingType === "lease") return `${formatted}/year`;
    return formatted;
  }

  const getListingTypeBadgeClass = (type) => {
    switch (type) {
      case "sale": return "badge-sale";
      case "rent": return "badge-rent";
      case "lease": return "badge-lease";
      default: return "";
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    console.log()
    if (property) {
      authService.incrementInquiries(property._id)
      const res = await fetch("/api/send-agent-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactForm.name, email: contactForm.email, phone: contactForm.phone, message: contactForm.message, listingId: property._id })
      });
      console.log(property._id);
      if (!res.ok) {
        alert("Failed to send inquiry. Please try again later.")
        return
      }

      alert("Your inquiry has been sent! The property owner will contact you soon.")
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setShowContactForm(false)
    }
  }


  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading property details...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="not-found-container">
        <Home className="not-found-icon" />
        <h2 className="not-found-title">Property Not Found</h2>
        <p className="not-found-text">The property you're looking for doesn't exist.</p>
        <Link className="link" href="/properties">
          <Button className="button button-primary">Back to Properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="property-detail-page">
      {/* Header */}
      <header className="header-detail">
        <div className="header-container-detail">
          <div className="header-left">
            <Link className="link" href="/properties">
              <Button className="button-outline button-back">
                <ArrowLeft />
                Back to Properties
              </Button>
            </Link>
            <div className="header-logo">
              <video src="/logoTest.mp4" autoPlay loop muted></video>
            </div>
          </div>
          <div className="header-right">
            <Button className="button-outline" onClick={shareContent}><Share2 /></Button>
          </div>
        </div>
      </header>

      <div className="main-content-detail">
        <div className="grid-layout">
          {/* Main Content */}
          <div className="main-column">
            {/* Image Gallery */}
            <Card>
              <div className="image-gallery">
                <img
                  src={property.images?.[currentImageIndex]?.url || "/placeholder.png"}
                  alt={property.title}
                  className="main-image"
                />
                {property.images && property.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="image-nav-button left"><ChevronLeft /></button>
                    <button onClick={nextImage} className="image-nav-button right"><ChevronRight /></button>
                  </>
                )}
                <div className="image-badge-container top-left">
                  <Badge className={getListingTypeBadgeClass(property.listingType)}>For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}</Badge>
                </div>
                {property.featured && (
                  <div className="image-badge-container top-right">
                    <Badge className="badge-featured">Featured</Badge>
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="thumbnail-container">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="details-header">
                  <span className="details-title">{property.title}</span>
                  <span className="price">{formatPrice(property.price, property.listingType)}</span>
                </div>
                <div className="address-container">
                  <MapPin className="icon-sm" />
                  <span>{property.address}</span>
                </div>
                <div className="details-grid">
                  <div className="detail-item-stat"><Bed className="icon-lg" /><span>{property.beds} Bedrooms</span></div>
                  <div className="detail-item-stat"><Bath className="icon-lg" /><span>{property.baths} Bathrooms</span></div>
                  <div className="detail-item-stat"><Square className="icon-lg" /><span>{property.sqft} sqft</span></div>
                </div>
                <div className="stats-header-row">
                  <div className="stat-item"><Eye className="icon-sm" /><span className="text-sm">{property.views || 0} views</span></div>
                  <div className="stat-item"><MessageSquare className="icon-sm" /><span className="text-sm">{property.inquiries || 0} inquiries</span></div>
                  <div className="stat-item"><Calendar className="icon-sm" /><span className="text-sm">Listed {new Date(property.createdAt).toLocaleDateString()}</span></div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="section-title">Description</h3>
                <p className="description-text">{property.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="sidebar-column">
            {/* Contact Card */}
            <Card>
              <CardHeader><CardTitle>Contact Agent</CardTitle></CardHeader>
              <CardContent>
                <div className="agent-profile">
                  <div className="agent-icon-bg"><span className="svgWhite"><User /></span></div>
                  <div>
                    <h3 className="agent-name">{`${agentInfo?.firstName || "Property"} ${agentInfo?.lastName || "Agent"}`}</h3>
                    <p className="agent-company">TheNigeriaProperties</p>
                  </div>
                </div>
                <div className="contact-buttons">
                  <Button className="button button-primary" onClick={() => setShowContactForm(!showContactForm)}> <span className="svgWhite"><MessageSquare /></span> Send Message</Button>
                  <Button className="button-outline"><span className="svgBlack"><Phone /></span><a href={`tel:${agentInfo?.phone || "Not provided"}`}>{agentInfo?.phone || "Not provided"}</a></Button>
                  <Button className="button-outline"><span className="svgBlack"><Mail /></span><a href={`mailto:${agentInfo?.email || "Not provided"}`}>{agentInfo?.email || "Not provided"}</a></Button>
                </div>
                {showContactForm && (
                  <form onSubmit={handleContactSubmit} className="contact-form">
                    <div><Label>Name</Label><Input value={contactForm.name} onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
                    <div><Label>Email</Label><Input type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} required /></div>
                    <div><Label>Phone</Label><Input value={contactForm.phone} onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
                    <div><Label>Message</Label><Textarea value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="I'm interested in this property..." required /></div>
                    <Button type="submit" className="button button-primary">Send Inquiry</Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader><CardTitle>Property Features</CardTitle></CardHeader>
              <CardContent>
                <div className="feature-list">
                  <div className="feature-item"><span>Property Type:</span><span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span></div>
                  <div className="feature-item"><span>Listing Type:</span><span>For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}</span></div>
                  <div className="feature-item"><span>Status:</span><span className="text-green-600">Active</span></div>
                  {property.listingType !== "sale" && (<div className="feature-item"><span>Lease Term:</span><span>12 months</span></div>)}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader><CardTitle>Property Stats</CardTitle></CardHeader>
              <CardContent>
                <div className="stats-list">
                  <div className="stat-row">
                    <div className="stat-label"><Eye className="icon-sm" />Views</div>
                    <span className="stat-value">{property.views || 0}</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label"><MessageSquare className="icon-sm" />Inquiries</div>
                    <span className="stat-value">{property.inquiries || 0}</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label"><Calendar className="icon-sm" />Days Listed</div>
                    <span className="stat-value">{Math.ceil((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}