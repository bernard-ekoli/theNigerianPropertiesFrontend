"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import "../../../../styles/editListing.css"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id // comes from [id]

  const [listing, setListing] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [],
    imagesToDelete: [],
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!listingId) {
      router.push("/dashboard")
    }
    async function getproperties() {
      try {
        const property = await fetch(`/api/properties/${listingId}`)
        if (!property.ok) {
          alert(property.statusText)
          router.push("/dashboard") // if not found, go back
          return
        }
        const data = await property.json()
        const listing = data.listing
        console.log("Fetched listing data:", listing)
        setListing(listing)
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price?.toString() || "",
          bedrooms: listing.beds?.toString() || "",
          bathrooms: listing.baths?.toString() || "",
          area: listing.sqft?.toString() || "",
          images: listing.images,
          imagesToDelete: [],
        })
      } catch (error) {
        alert("Error fetching listing")
        router.push("/dashboard")
      }
    }
    getproperties()
  }, [listingId])

  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  function handleImageDelete(index) {
    const imgToDelete = formData.images[index];
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      const updatedImagesToDelete = imgToDelete.id
        ? [...prev.imagesToDelete, imgToDelete.id]
        : prev.imagesToDelete;
      return {
        ...prev,
        images: updatedImages,
        imagesToDelete: updatedImagesToDelete,
      };
    });
  }

  async function handleSave() {
    if (!listing) return
    setSaving(true)

    try {
      if (!formData.title.trim()) throw new Error("Title required")

      if (!formData.description.trim()) {
        throw new Error("Description required")
      }

      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error("Valid price required")
      }

      const beds = parseInt(formData.bedrooms, 10)
      if (isNaN(beds) || beds < 0) {
        throw new Error("Valid number of bedrooms required")
      }

      const baths = parseInt(formData.bathrooms, 10)
      if (isNaN(baths) || baths < 0) {
        throw new Error("Valid number of bathrooms required")
      }

      const areaVal = parseInt(formData.area, 10)
      if (isNaN(areaVal) || areaVal <= 0) {
        throw new Error("Valid area required")
      }

      if (!formData.images || formData.images.length === 0) {
        throw new Error("At least one image is required")
      }

      const res = await fetch(`/api/properties/edit-listing/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          beds: beds,
          baths: baths,
          sqft: areaVal,
          imagesToDelete: formData.imagesToDelete,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update listing")
      }

      router.push("/dashboard")

      // const userListings = JSON.parse(localStorage.getItem("userListings") || "[]")
      /* 
            const updated = {
              ...listing,
              title: formData.title,
              description: formData.description,
              price: formData.price,
              location: formData.address,
              beds: parseInt(formData.bedrooms),
              baths: parseInt(formData.bathrooms),
              area: parseInt(formData.area),
              listingType: formData.listingType,
            }
      
            const updatedListings = userListings.map((ad) =>
              ad.id === listing.id ? updated : ad
            )
      
            localStorage.setItem("userListings", JSON.stringify(updatedListings))
            router.push("/dashboard") */
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!listing) return <p>Loading...</p>

  return (
    <div className="container">
      <h1 className="heading">Edit Listing</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <label className="label">Title</label>
        <input
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="input"
        />

        <label className="label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="textarea"
        ></textarea>

        <label className="label">Price<sub>/yr</sub> </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className="input"
        />
        <label className="label">Bedrooms</label>
        <input
          type="number"
          value={formData.bedrooms}
          onChange={(e) => handleInputChange("bedrooms", e.target.value)}
          className="input"
        />

        <label className="label">Bathrooms</label>
        <input
          type="number"
          value={formData.bathrooms}
          onChange={(e) => handleInputChange("bathrooms", e.target.value)}
          className="input"
        />

        <label className="label">Area (sqft)</label>
        <input
          type="number"
          value={formData.area}
          onChange={(e) => handleInputChange("area", e.target.value)}
          className="input"
        />
        <label className="label">Images</label>
        <div id="image-container">
          {formData.images && (
            formData.images.map((img, index) => {
              return (
                <div id="image-div-container" key={index}>
                  <div onClick={() => handleImageDelete(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                  </div>
                  <img src={img.url} alt="User Image" />
                </div>
              )
            })
          )}
        </div>
        <button onClick={handleSave} disabled={saving} className="button">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <Link href="/dashboard" className="link">
        Back to Dashboard
      </Link>
    </div>
  )
}
