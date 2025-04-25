    // signInWithGoogle.js
    import React from "react";
    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { auth } from "./firebase";
    import { toast } from "react-toastify";

    const SignInWithGoogle = () => {
    const handleGoogleSignIn = async () => {
        try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast.success("Logged in with Google!", { position: "top-center" });
        window.location.href = "/profile";
        } catch (error) {
        console.error(error);
        toast.error("Google Sign-in failed", { position: "bottom-center" });
        }
    };

    return (
        <div className="d-grid mt-3">
        <button className="btn btn-danger" onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
        </div>
    );
    };

    export default SignInWithGoogle;

