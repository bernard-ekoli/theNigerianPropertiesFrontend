"use client";

import { useEffect, useMemo, useState } from "react";
import "../../../styles/profile.css";

const PHONE_OTP_ENDPOINTS = {
  request: "/api/users/request-phone-update-otp",
  verify: "/api/users/verify-phone-update-otp",
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState("phone");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState({ type: "", text: "" });

  const initials = useMemo(() => {
    const first = formData.firstName?.trim()?.[0] || "";
    const last = formData.lastName?.trim()?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [formData.firstName, formData.lastName]);

  useEffect(() => {
    async function getUser() {
      setIsFetchingUser(true);

      try {
        const response = await fetch(`/api/users/`, { credentials: "include" });

        if (!response.ok) {
          setMessage({ type: "error", text: "Please sign in to view your profile." });
          setIsFetchingUser(false);
          return;
        }

        const data = await response.json();

        if (!data.success || !data.rest) {
          setMessage({ type: "error", text: "We could not load your profile details." });
          setIsFetchingUser(false);
          return;
        }

        const userObj = {
          firstName: data.rest.firstName ?? "",
          lastName: data.rest.lastName ?? "",
          email: data.rest.email ?? "",
          phone: data.rest.phone ?? "",
        };

        setUser(userObj);
        setFormData(userObj);
      } catch (error) {
        console.error("Fetch failed:", error);
        setMessage({ type: "error", text: "Network error while loading your profile." });
      } finally {
        setIsFetchingUser(false);
      }
    }

    getUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/users/edit-user-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: resData.message || "Profile update failed." });
        return;
      }

      setUser((prev) => ({ ...prev, firstName: formData.firstName, lastName: formData.lastName }));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Network error while saving your profile." });
    } finally {
      setLoading(false);
    }
  };

  const openPhoneModal = () => {
    setPhoneDraft(formData.phone || "");
    setOtp("");
    setOtpStep("phone");
    setPhoneMessage({ type: "", text: "" });
    setIsPhoneModalOpen(true);
  };

  const requestPhoneOtp = async (e) => {
    e.preventDefault();

    if (!phoneDraft.trim()) {
      setPhoneMessage({ type: "error", text: "Enter the new phone number first." });
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage({ type: "", text: "" });

    try {
      const res = await fetch(PHONE_OTP_ENDPOINTS.request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneDraft.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPhoneMessage({ type: "error", text: data.message || "Could not send OTP." });
        return;
      }

      setOtpStep("otp");
      setPhoneMessage({
        type: "success",
        text: `OTP sent to ${formData.email}. Enter it below to confirm your new number.`,
      });
    } catch (error) {
      console.error(error);
      setPhoneMessage({ type: "error", text: "Network error while sending OTP." });
    } finally {
      setPhoneLoading(false);
    }
  };

  const verifyPhoneOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setPhoneMessage({ type: "error", text: "Enter the OTP sent to your email." });
      return;
    }

    setPhoneLoading(true);

    try {
      const res = await fetch(PHONE_OTP_ENDPOINTS.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneDraft.trim(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPhoneMessage({ type: "error", text: data.message || "OTP verification failed." });
        return;
      }

      setFormData((prev) => ({ ...prev, phone: phoneDraft.trim() }));
      setUser((prev) => ({ ...prev, phone: phoneDraft.trim() }));
      setIsPhoneModalOpen(false);
      setMessage({ type: "success", text: "Phone number updated successfully." });
    } catch (error) {
      console.error(error);
      setPhoneMessage({ type: "error", text: "Network error while verifying OTP." });
    } finally {
      setPhoneLoading(false);
    }
  };

  if (isFetchingUser) return <div className="loading">Loading profile...</div>;

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="card empty-state">
            <h1>Profile unavailable</h1>
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            <a href="/auth" className="btn primary">Sign in</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <a href="/" className="logo" aria-label="TheNigeriaProperties home">
          <video src="/logoTest.mp4" muted autoPlay loop />
        </a>
        <a href="/dashboard" className="back-btn">Back to Dashboard</a>
      </header>

      <main className="container">
        <div className="page-title-row">
          <div>
            <span className="eyebrow">Account settings</span>
            <h1>Edit Profile</h1>
            <p>Keep your account details current for property enquiries and dashboard activity.</p>
          </div>
        </div>

        <section className="card profile-card">
          <div className="profile-overview">
            <div className="avatar">{initials}</div>
            <div>
              <h2>{formData.firstName} {formData.lastName}</h2>
              <p>{formData.email}</p>
              <small>{formData.phone || "No phone number added yet"}</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Name changes save immediately. Phone updates require email OTP verification.</p>
            </div>
          </div>

          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "error" : ""}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="field">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "error" : ""}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                title="Email cannot be edited"
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <div className="locked-field">
                <input type="tel" value={formData.phone || "No phone number added"} disabled />
                <button type="button" className="btn outline" onClick={openPhoneModal}>
                  Update Number
                </button>
              </div>
            </div>

            <div className="actions">
              <a href="/dashboard" className="btn outline">Cancel</a>
              <button type="submit" disabled={loading} className="btn primary">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>

      {isPhoneModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="phone-modal-title">
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsPhoneModalOpen(false)}
              aria-label="Close phone update modal"
            >
              ×
            </button>

            <span className="eyebrow">Email OTP verification</span>
            <h2 id="phone-modal-title">Update phone number</h2>
            <p className="modal-copy">
              We will send an OTP to your email address before changing the phone number on your account.
            </p>

            {phoneMessage.text && (
              <div className={`message ${phoneMessage.type}`}>{phoneMessage.text}</div>
            )}

            {otpStep === "phone" ? (
              <form onSubmit={requestPhoneOtp} className="modal-form">
                <div className="field">
                  <label htmlFor="phoneDraft">New Phone Number</label>
                  <input
                    id="phoneDraft"
                    type="tel"
                    value={phoneDraft}
                    onChange={(e) => setPhoneDraft(e.target.value)}
                    placeholder="+234..."
                  />
                </div>
                <button type="submit" className="btn primary full" disabled={phoneLoading}>
                  {phoneLoading ? "Sending OTP..." : "Send OTP to Email"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyPhoneOtp} className="modal-form">
                <div className="field">
                  <label htmlFor="otp">OTP Code</label>
                  <input
                    id="otp"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn outline" onClick={() => setOtpStep("phone")}>
                    Change Number
                  </button>
                  <button type="submit" className="btn primary" disabled={phoneLoading}>
                    {phoneLoading ? "Verifying..." : "Verify & Update"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
