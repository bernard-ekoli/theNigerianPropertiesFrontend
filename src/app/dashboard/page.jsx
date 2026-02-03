"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import '../../styles/dashboard.css'
import {
    Home,
    Plus,
    Edit,
    Eye,
    Trash2,
    User,
    LogOut,
    MapPin,
    Bed,
    Bath,
    Square,
    Calendar,
    TrendingUp,
    MessageCircle,
    PhoneCall,
    MailOpen,
} from "lucide-react"

export default function Dashboard() {
    const router = useRouter()
    const [showNav, setShowNav] = useState(false)
    const [user, setUser] = useState(null)
    const [listings, setListings] = useState([])
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalViews: 0,
        totalEarnings: 0,
    })
    const [showMessage, setShowMessage] = useState(false)
    const [messages, setMessages] = useState([])
    const [networkError, setNetworkError] = useState(false)
    const [loading, setLoading] = useState(true)

    // 1. First, fetch the user
    useEffect(() => {
        async function fetchUserData() {
            setLoading(true)
            try {
                const response = await fetch('/api/get-user-details');
                if (!response.ok) throw new Error('Failed to fetch user');
                const body = await response.json()
                setUser(body.rest);
            } catch (error) {
                console.error("User fetch error:", error);
                setNetworkError(true)
            }
            setLoading(false)
        }
        fetchUserData();
    }, [])


    // 2. ONLY fetch listings once the user object exists
    useEffect(() => {
        if (!user || !user._id) return;

        async function fetchListings() {
            setLoading(true)
            try {
                const res = await fetch('/api/properties/userProperty', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch listings');

                const data = await res.json();
                const allListings = data.listings || [];

                const userListings = allListings.filter(l => l.userId === user._id);
                setListings(userListings);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
            setLoading(false);
        }

        fetchListings();
    }, [user]);
    // 3. Fetch stats once user is available
    useEffect(() => {
        const activeListings = listings.filter(
            l => l.expiresAt && new Date(l.expiresAt) > new Date()
        ).length;

        setStats({
            totalListings: listings.length,
            activeListings,
            totalViews: listings.reduce(
                (sum, l) => sum + (l.views || 0),
                0
            ),
        });
    }, [listings]);
    const setDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    const handleMessage = (id) => {
        const listing = listings.find(l => (l.id || l._id) === id);
        if (listing && listing.messages) {
            setMessages(listing.messages);
        }
        setShowMessage(true);
    }
    const handleLogout = async () => {
        const res = await fetch('/api/logout')
        if (res.ok) router.push('/auth')
    }

    const handleDeleteListing = async (listingId) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            setLoading(true)
            // Add your API delete logic here
            const res = await fetch(`/api/properties/delete-listing/${listingId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                alert("Listing deleted successfully")
                setListings(listings.filter(listing => (listing.id || listing._id) !== listingId))
            } else {
                alert("Failed to delete listing")
            }
            setLoading(false)
        }
    }

    const formatPrice = (price, listingType) => {
        if (!price) return "₦0";
        const numPrice = Number.parseInt(price.toString().replace(/[^\d]/g, ""))
        const formatted = new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numPrice)

        return (listingType === "rent" || listingType === "lease") ? `${formatted}/year` : formatted
    }

    const getStatusBadge = (listing) => {
        const now = new Date();

        const isExpired = listing.expiresAt
            ? new Date(listing.expiresAt) <= now
            : false;
        return isExpired ? 'Expired' : 'Active';
    };


    const getListingTypeBadge = (type) => {
        const colors = { sale: "bg-green-600", rent: "bg-emerald-600", lease: "bg-teal-600" }
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[type || 'sale']} text-white`}>
                For {(type || 'sale').charAt(0).toUpperCase() + (type || 'sale').slice(1)}
            </span>
        )
    }
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Processing...</div>
    }
    return (
        /* Added id="dashboard-page" to help you target styles more specifically in your CSS */
        <div className="dashboard" id="dashboard-page">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <Link href="/" className="brand">
                                <video src="/logoTest.mp4" autoPlay loop muted></video>
                            </Link>
                        </div>

                        <div className="header-right">
                            <Link href="/dashboard/profile">
                                <button className="btn btn-outline">
                                    <User className="icon-sm" /> Edit Profile
                                </button>
                            </Link>
                            <button className="btn btn-outline" onClick={handleLogout}>
                                <LogOut className="icon-sm" /> Logout
                            </button>
                        </div>
                        <div className="hamurger">
                            <svg onClick={() => setShowNav(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`hiddenNav ${showNav ? 'display-flex' : 'display-none'}`}>
                <div className="close" onClick={() => setShowNav(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </div>
                <Link href="/dashboard/profile">
                    <button className="btn btn-outline"><User className="icon-sm" /> Edit Profile</button>
                </Link>
                <button className="btn btn-outline" onClick={handleLogout}><LogOut className="icon-sm" /> Logout</button>
            </div>

            <div className="container page-content">
                <div className="welcome">
                    <h1>Welcome back, {user.firstName || user.email}!</h1>
                    <p>Manage your property listings and track your performance.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Total Listings</h2>
                            <Home className="icon-sm" />
                        </div>
                        <div className="stat-value">{stats.totalListings}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Active Listings</h2>
                            <TrendingUp className="icon-sm" />
                        </div>
                        <div className="stat-value text-green">{stats.activeListings}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Total Views</h2>
                            <Eye className="icon-sm" />
                        </div>
                        <div className="stat-value">{stats.totalViews}</div>
                    </div>
                </div>

                <div className="actions">
                    <Link href="/dashboard/create-listing">
                        <button className="btn btn-primary"><Plus className="icon-sm" /> Create New Listing</button>
                    </Link>
                    <Link href="/properties">
                        <button className="btn btn-outline"><Eye className="icon-sm" /> View All Properties</button>
                    </Link>
                </div>

                <div className="listings-card">
                    <div className="card-header">
                        <h2>Your Listings</h2>
                    </div>
                    <div className="card-body">
                        {listings.length === 0 ? (
                            <div className="empty-list">
                                <Home className="icon-xl text-gray" />
                                <h3>No listings yet</h3>
                                <p>Create your first property listing to get started.</p>
                            </div>
                        ) : (
                            listings.map((listing) => (
                                <div key={listing.id || listing._id} className="listing-item">
                                    <div className="listing-details">
                                        <div className="listing-header">
                                            <h3>{listing.title}</h3>
                                            <span className="listing-type-badge">
                                                {getListingTypeBadge(listing.listingType)}
                                            </span>
                                            <span className={getStatusBadge(listing) === 'Expired' ? 'expired-badge' : 'listing-status-badge'}>
                                                {getStatusBadge(listing)}
                                            </span>
                                        </div>
                                        <div className="listing-location">
                                            <MapPin className="icon-sm" />
                                            <span>{listing.address}</span>
                                        </div>
                                        <div className="listing-info">
                                            <div><span><Bed className="icon-sm" /></span><span>{listing.beds} Beds</span></div>
                                            <div><span><Bath className="icon-sm" /></span><span>{listing.baths} Baths</span></div>
                                            <div><span><Square className="icon-sm" /></span><span>{listing.sqft}Sqft</span></div>
                                        </div>
                                        <div className="listing-footer">
                                            <span className="price">{formatPrice(listing.price, listing.listingType)}</span>
                                            <div className="expires">
                                                <Calendar className="icon-sm" />
                                                Expires: {
                                                    new Date(listing.expiresAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="listing-actions">
                                        <Link href={`/properties/${listing.id || listing._id}`}>
                                            <button className="btn btn-outline"><Eye className="icon-sm" /> View</button>
                                        </Link>
                                        <Link href={`/dashboard/edit-listing/${listing.id || listing._id}`}>
                                            <button className="btn btn-outline"><Edit className="icon-sm" /> Edit</button>
                                        </Link>
                                        <button onClick={() => handleDeleteListing(listing.id || listing._id)} className="btn btn-danger">
                                            <Trash2 className="icon-sm" /> Delete
                                        </button>
                                        <button onClick={() => handleMessage(listing.id || listing._id)} className="btn btn-outline">
                                            <MessageCircle className="icon-sm" /> Chats
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="messages-section" style={{ display: showMessage ? 'flex' : 'none' }}>
                    <span>Messages</span>
                    <div className="messages-container">
                        {
                            !messages ? (
                                <p>No messages yet.</p>
                            ) : (
                                messages.map((msg, index) => (
                                    <div className="message-item" key={index}>
                                        <div key={index} className="message-info">
                                            <User className="icon-sm" />
                                            <div>
                                                <span>{msg.name}</span>
                                                <span>{setDate(msg.date)}</span>
                                            </div>
                                        </div>
                                        <div className="message-body">
                                            <span>
                                                Message:
                                                <p>{msg.message}</p>
                                            </span>
                                        </div>
                                        <div className="message-contacts">
                                            <a href={`tel:${msg.phone}`}>
                                                <button>
                                                    <PhoneCall className="icon-sm" /> Call
                                                </button>
                                            </a>
                                            <a href={`mailto:${msg.email}`}>
                                                <button>
                                                    <MailOpen className="icon-sm" /> Email
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                    <button className="message-btn-close" onClick={() => setShowMessage(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}