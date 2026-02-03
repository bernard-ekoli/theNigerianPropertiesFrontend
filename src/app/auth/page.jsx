"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/auth.module.css";

/* ================= AUTH SERVICE ================= */

const AuthService = {
    signIn: async (email, password) => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const resData = await res.json();

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
            const res = await fetch(
                "/api/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(data),
                }
            );

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

/* ================= LOGIN ================= */

function LoginForm({ onSwitchToSignup }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
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
                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtitle}>
                    Sign in to your TheNigeriaProperties account
                </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.button} disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <div className={styles.footer}>
                <button className={styles.link} onClick={onSwitchToSignup}>
                    Don’t have an account? Sign up
                </button>
            </div>
        </div>
    );
}

/* ================= SIGNUP ================= */

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
                <h2 className={styles.title}>Create Account</h2>
                <p className={styles.subtitle}>
                    Join TheNigeriaProperties to start listing properties
                </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>First Name</label>
                        <input
                            className={styles.input}
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Last Name</label>
                        <input
                            className={styles.input}
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Confirm Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.button} disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className={styles.footer}>
                <button className={styles.link} onClick={onSwitchToLogin}>
                    Already have an account? Sign in
                </button>
            </div>
        </div>
    );
}

/* ================= PAGE ================= */

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.page}>
            {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
}
