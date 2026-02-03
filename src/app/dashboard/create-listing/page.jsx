// app/create-listing/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Upload,
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  CheckCircle,
  Image
} from 'lucide-react';
import Link from 'next/link';
// Removed: import { CldUploadButton } from 'next-cloudinary';
import '../../../styles/createListing.css';
import formatCustomCurrency from '../../../../tools/formatCurrency'

// --- MAIN PAGE COMPONENT ---

export default function CreateListingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredListing, setFeaturedListing] = useState("...Loading")
  const [listingPrices, setListingPrices] = useState([])
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'house',
    listingType: 'sale',
    featured: false,
    duration: "30",
    images: [], // Will store { file: File, previewUrl: 'blob:...' }/
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/get-user-details')
      const data = await res.json();
      console.log('User data fetched:', data);
      if (!res.ok) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      setUser(data.rest);
    }
    fetchUser();
    setIsLoading(false);
    async function getPrices() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/prices');
        const result = await res.json();
        console.log('Prices fetched:', result.data.prices);
        if (!res.ok) {
          console.error('Error fetching prices:', result.error || 'Unknown error');
          return;
        }
        const { featuredListing, ...listings } = result.data.prices
        setFeaturedListing(featuredListing)
        setListingPrices(listings)
      } catch (error) {
        console.log('There was an error from getPrices', error);
      } finally {
        setIsLoading(false)
      }
    }
    getPrices()
  }, [router, formData.images]); // Add formData.images to dependency array for cleanup

  const uploadToCloudinary = async (file, sig) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    return res.json();
  };


  const getSignature = async () => {
    const res = await fetch(`${process.env.backend_url}/api/cloudinary/signature`, {
      credentials: "include",
    });
    return res.json();
  };


  const uploadImages = async (files) => {
    const sig = await getSignature();

    const uploads = await Promise.all(
      files.map(file => uploadToCloudinary(file, sig))
    );

    return uploads.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const newErrors = { ...errors };
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (formData.images.length > 10) {
      newErrors.images = 'Maximum of 10 images allowed';
      setErrors(newErrors);
      return;
    }; // Max 10 images
    const newImages = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset input so same file can be reselected
    e.target.value = null;
  };


  // --- (Validation and Cost Calculation) ---

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.price || Number.parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.beds || Number.parseInt(formData.beds) < 0)
      newErrors.beds = 'Valid number of bedrooms is required';
    if (!formData.baths || Number.parseFloat(formData.baths) < 0)
      newErrors.baths = 'Valid number of bathrooms is required';
    if (!formData.sqft || Number.parseInt(formData.sqft) <= 0)
      newErrors.sqft = 'Valid square footage is required';
    if (formData.images.length < 2)
      newErrors.images = 'At least two images are required';
    if (formData.images.length > 10)
      newErrors.images = 'Maximum of 10 images allowed';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    let baseCost = 5000
    const durationMultiplier = Number.parseInt(formData.duration) / 30;
    const featuredCost = formData.featured ? featuredListing : 0;
    let listingTypeMultiplier = 1;
    if (formData.listingType === 'rent') listingTypeMultiplier = 0.8;
    else if (formData.listingType === 'lease') listingTypeMultiplier = 0.9;
    return baseCost * durationMultiplier * listingTypeMultiplier + featuredCost;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;
    if(user.phone === "" || !user.phone){
      alert("Please update your profile with a valid phone number before creating a listing.");
      router.push('/dashboard/profile');
      return;
    }

    setIsSubmitting(true);

    try {

      const images = await uploadImages(formData.images.map(img => img.file));

      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        beds: formData.beds,
        baths: formData.baths,
        sqft: formData.sqft,
        type: formData.type,
        listingType: formData.listingType,
        featured: formData.featured,
        duration: formData.duration,
        images: images, // already an array [{ url, public_id }]
      };

      const res = await fetch("/api/create-listing", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!res.ok) {
        const errorResult = await res.json();
        console.error("Create listing failed:", errorResult);
        setIsSubmitting(false);
        return;
      }
      router.push('/dashboard');

    } catch (error) {
      console.error("Create listing error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // ... (Loading state and user checks remain the same) ...
  if (isLoading) {
    return (
      <div className="loading-container">
        <Home className="loading-icon" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const cost = calculateCost();

  const getPriceLabel = () => {
    switch (formData.listingType) {
      case 'rent':
        return 'Monthly Rent';
      case 'lease':
        return 'Monthly Lease';
      default:
        return 'Sale Price';
    }
  };

  const getListingTypeDescription = () => {
    switch (formData.listingType) {
      case 'rent':
        return 'Monthly rental property (20% discount on listing fees)';
      case 'lease':
        return 'Long-term lease property (10% discount on listing fees)';
      default:
        return 'Property for sale';
    }
  };

  return (
    <div className="create-listing-page-container">
      {/* Header */}
      <header className="create-listing-header">
        <div className="create-listing-header-left">
          <div className="hll">
            <Link href="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </Link>
          </div>
          <Link href="/" className="create-listing-brand">
            <video src="/logoTest.mp4" autoPlay loop muted></video>
          </Link>
        </div>
      </header>

      <div className="main-content-area">
        <div className="form-layout">
          {/* Main Form Sections */}
          <div className="form-sections">
            {/* Basic Information Section */}
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <Home className="card-title-icon" />
                  Basic Information
                </h2>
              </header>
              <div className="dummy-card-content card-content-spacing">
                <div>
                  <label htmlFor="title" className="dummy-label">Property Title</label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Beautiful 3BR home in downtown..."
                    className={errors.title ? 'input-error dummy-input' : 'dummy-input'}
                  />
                  {errors.title && <p className="error-message">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="dummy-label">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your property..."
                    rows={4}
                    className={errors.description ? 'input-error dummy-textarea' : 'dummy-textarea'}
                  />
                  {errors.description && <p className="error-message">{errors.description}</p>}
                </div>

                <div className="grid-2-col-md">
                  <div>
                    <label htmlFor="type" className="dummy-label">Property Type</label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="dummy-select"
                    >

                      <optgroup label="Residential">
                        <option value="house">House</option>
                        <option value="flat">Apartment / Flat</option>
                        <option value="condo">Condo</option>
                      </optgroup>
                      <optgroup label="Commercial / Events">
                        <option value="eventp">Event Place/Halls</option>
                        <option value="office">Office Space</option>
                      </optgroup>
                      <optgroup label="Others">
                        <option value="land">Land</option>
                      </optgroup>

                    </select>
                  </div>

                  <div>
                    <label htmlFor="listingType" className="dummy-label">Listing Type</label>
                    <select
                      id="listingType"
                      value={formData.listingType}
                      onChange={(e) => handleInputChange('listingType', e.target.value)}
                      className="dummy-select"
                    >
                      <option value="sale" className="dummy-select-item">For Sale</option>
                      <option value="rent" className="dummy-select-item">For Rent</option>
                      <option value="lease" className="dummy-select-item">For Lease</option>
                    </select>
                    <p className="description-text">{getListingTypeDescription()}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Location & Price Section */}
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <MapPin className="card-title-icon" />
                  Location & Pricing
                </h2>
              </header>
              <div className="dummy-card-content card-content-spacing">
                <div>
                  <label htmlFor="address" className="dummy-label">Address</label>
                  <input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                    className={errors.address ? 'input-error dummy-input' : 'dummy-input'}
                  />
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="dummy-label">{getPriceLabel()} per Month</label>
                  <div className="input-with-icon">
                    <span className="input-icon">₦</span>
                    <input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder={formData.listingType === 'sale' ? '42500000' : '250000'}
                      className={`input-padded-left dummy-input ${errors.price ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.price && <p className="error-message">{errors.price}</p>}
                </div>
              </div>
            </section>

            {/* Property Details Section */}
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <Square className="card-title-icon" />
                  Property Details
                </h2>
              </header>
              <div className="dummy-card-content">
                <div className="grid-3-col">
                  <div>
                    <label htmlFor="beds" className="dummy-label">Bedrooms</label>
                    <div className="input-with-icon">
                      <Bed className="input-icon" />
                      <input
                        id="beds"
                        type="number"
                        value={formData.beds}
                        onChange={(e) => handleInputChange('beds', e.target.value)}
                        className={`input-padded-left dummy-input ${errors.beds ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.beds && <p className="error-message-small">{errors.beds}</p>}
                  </div>

                  <div>
                    <label htmlFor="baths" className="dummy-label">Bathrooms</label>
                    <div className="input-with-icon">
                      <Bath className="input-icon" />
                      <input
                        id="baths"
                        type="number"
                        step="0.5"
                        value={formData.baths}
                        onChange={(e) => handleInputChange('baths', e.target.value)}
                        className={`input-padded-left dummy-input ${errors.baths ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.baths && <p className="error-message-small">{errors.baths}</p>}
                  </div>

                  <div>
                    <label htmlFor="sqft" className="dummy-label">sqft</label>
                    <div className="input-with-icon">
                      <Square className="input-icon" />
                      <input
                        id="sqft"
                        type="number"
                        value={formData.sqft}
                        onChange={(e) => handleInputChange('sqft', e.target.value)}
                        className={`input-padded-left dummy-input ${errors.sqft ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.sqft && <p className="error-message-small">{errors.sqft}</p>}
                  </div>
                </div>
              </div>
            </section>
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <Image className="card-title-icon" />
                  Upload Images
                </h2>
                <p>Upload at least 2 images</p>
              </header>
              {errors.images && <p className="error-message">{errors.images}</p>}

              <div className="image-upload-section">
                {/* Upload Box */}
                <label className="image-upload-box">
                  <Upload className="upload-icon" />
                  <span>Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>

                {/* Previews */}
                <div className="image-preview-flex">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview-container">
                      <img src={img.previewUrl} alt="preview" className="image-preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="remove-image-icon" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          {/* Sidebar */}
          <aside className="sidebar">
            {/* Listing Options Section */}
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <Star className="card-title-icon" />
                  Listing Options
                </h2>
              </header>
              <div className="dummy-card-content">
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id='featured'
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="dummy-checkbox"
                  />
                  <label htmlFor="featured">Feature this listing ({formatCustomCurrency('NGN', featuredListing)})</label>
                </div>
                <br />
                <br />
                <div>
                  <label htmlFor="duration" className="dummy-label">Duration</label>
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="dummy-select"
                  >
                    <option value="30" className="dummy-select-item">30 days ({formatCustomCurrency('NGN', listingPrices[30])})</option>
                    <option value="60" className="dummy-select-item">60 days ({formatCustomCurrency('NGN', listingPrices[60])})</option>
                    <option value="90" className="dummy-select-item">90 days ({formatCustomCurrency('NGN', listingPrices[90])})</option>
                  </select>
                </div>
              </div>
            </section>
            {/* Cost Summary Section */}
            <section className="dummy-card">
              <header className="dummy-card-header">
                <h2 className="dummy-card-title card-title-icon-wrapper">
                  <CheckCircle className="card-title-icon" />
                  Cost Summary
                </h2>
              </header>
              <div className="dummy-card-content">
                <p>Listing Fee: {formatCustomCurrency('NGN', cost.toFixed(2))}</p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-button dummy-button"
                >
                  {isSubmitting ? 'Processing...' : `Proceed to Pay ${formatCustomCurrency('NGN', cost.toFixed(2))}`}
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );

}