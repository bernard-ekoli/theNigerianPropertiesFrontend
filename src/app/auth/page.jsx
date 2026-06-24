"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/auth.module.css";

const AuthService = {
    signIn: async (email, password) => {
        try {
            const res = await fetch(`/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const resData = await res.json();

            if (res.status === 401) {
                return { success: false, message: resData.message || "Invalid Credentials" };
            }

            if (!res.ok) {
                return { success: false, message: resData.message || "Login failed" };
            }

            return resData;
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: "Network or server error" };
        }
    },

    signUp: async (data) => {
        try {
            const res = await fetch(`/api/users/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            if (!res.ok) {
                return { success: false, message: resData.message || "Signup failed" };
            }

            return resData;
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, message: "Network or server error" };
        }
    },
};

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
            <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.1 3.1" />
            <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.2-.8" />
        </svg>
    );
}

function AuthShell({ children, isLogin }) {
    return (
        <main className={styles.page}>
            <section className={styles.authWrap}>
                <aside className={styles.brandPanel}>
                    <a href="/" className={styles.logoLink}>
                        <img src="/LOGO.png" alt="TheNigeriaProperties" className={styles.logo} />
                    </a>

                    <div className={styles.brandCopy}>
                        <span className={styles.kicker}>Nigerian property marketplace</span>
                        <h1>{isLogin ? "Welcome back to smarter property search." : "Start listing and managing property faster."}</h1>
                        <p>
                            Access saved listings, manage property enquiries, and connect with buyers,
                            renters, owners, and agents across Nigeria.
                        </p>
                    </div>

                    <div className={styles.benefitGrid}>
                        <div>
                            <strong>10,000+</strong>
                            <span>Listed properties</span>
                        </div>
                        <div>
                            <strong>36</strong>
                            <span>States covered</span>
                        </div>
                    </div>

                    <ul className={styles.checkList}>
                        <li>Save homes, land, and commercial spaces</li>
                        <li>List properties and manage enquiries</li>
                        <li>Find verified options in top Nigerian cities</li>
                    </ul>
                </aside>

                <div className={styles.formPanel}>{children}</div>
            </section>
        </main>
    );
}

function LoginForm({ onSwitchToSignup }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        const result = await AuthService.signIn(
            formData.email.trim().toLowerCase(),
            formData.password
        );

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <span className={styles.formEyebrow}>Account access</span>
                <h2 className={styles.title}>Sign in</h2>
                <p className={styles.subtitle}>Continue to your TheNigeriaProperties dashboard.</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-email">Email address</label>
                    <input
                        id="login-email"
                        className={styles.input}
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-password">Password</label>
                    <div className={styles.passwordWrap}>
                        <input
                            id="login-password"
                            className={`${styles.input} ${styles.passwordInput}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.button} disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className={styles.footer}>
                <span>New here?</span>
                <button className={styles.link} onClick={onSwitchToSignup}>
                    Create an account
                </button>
            </div>
        </div>
    );
}

function SignupForm({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        const result = await AuthService.signUp({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            password: formData.password,
        });

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <span className={styles.formEyebrow}>Join the marketplace</span>
                <h2 className={styles.title}>Create account</h2>
                <p className={styles.subtitle}>List, save, and manage Nigerian property opportunities.</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="first-name">First name</label>
                        <input
                            id="first-name"
                            className={styles.input}
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="last-name">Last name</label>
                        <input
                            id="last-name"
                            className={styles.input}
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="signup-email">Email address</label>
                    <input
                        id="signup-email"
                        className={styles.input}
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Phone number</label>
                    <input
                        id="phone"
                        className={styles.input}
                        type="tel"
                        placeholder="+234..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="signup-password">Password</label>
                    <div className={styles.passwordWrap}>
                        <input
                            id="signup-password"
                            className={`${styles.input} ${styles.passwordInput}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirm-password">Confirm password</label>
                    <div className={styles.passwordWrap}>
                        <input
                            id="confirm-password"
                            className={`${styles.input} ${styles.passwordInput}`}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repeat password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.button} disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className={styles.footer}>
                <span>Already registered?</span>
                <button className={styles.link} onClick={onSwitchToLogin}>
                    Sign in
                </button>
            </div>
        </div>
    );
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <AuthShell isLogin={isLogin}>
            {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </AuthShell>
    );
}
