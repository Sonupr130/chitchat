import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hero from "../assets/hero_1.png";
import hero2 from "../assets/hero_2.png";
import Footer from "@/components/Footer";
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import chitchat from "../assets/chitchat.png";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import { signInWithPopup, auth, provider } from "../config/firebase.js";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore(); 

  const handleGoogleSignIn = async () => {
    try {
      // 1. Sign in with Firebase
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const { displayName, email, photoURL, uid } = result.user;

       // 2. Send to your backend
      const { data } = await axios.post("http://localhost:8000/api/auth/google-login", {
        name: displayName,
        email,
        photo: photoURL,
        uid,
      });

      // // 3. Store tokens and user data
      // localStorage.setItem('token', data.token); 
      // localStorage.setItem('user', JSON.stringify(data.user));
      // console.log(data);
      // setUser(data.user);

      // 3. Store tokens and user data using Zustand's login method
    // This handles both localStorage and state management in one call
    useAuthStore.getState().login({
      token: data.token,
      user: data.user
    });

    console.log("Login successful, user data:", data.user);
      navigate("/chat");
    } catch (error) {
      console.log(error);
      console.error("Google sign-in failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-12 flex-1">
        {/* Chat Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={hero} alt="Chat Illustration" className="w-full max-w-md" />
        </div>

        {/* Auth Card */}
        <Card className="w-full md:w-1/3 p-6 shadow-lg">
          <CardContent>
            <div className="flex justify-center">
              <h2 className="text-xl font-semibold text-center mb-4 flex gap-2">
                Login to{" "}
                <span>
                  <img src={chitchat} width={85} alt="" />
                </span>
              </h2>
            </div>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle size={18} /> Continue with Google
              </Button>
              <Button
                onClick={() => navigate("/phone-auth")}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <FaPhoneAlt size={18} /> Continue with Phone
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <div className="flex flex-col md:flex-row items-center px-8 md:px-20 py-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            Connect with Friends Anytime
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            ChitChat is a modern chat application that allows you to stay
            connected with friends and family. Enjoy seamless messaging with a
            user-friendly interface and top-notch security.
          </p>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src={hero2}
            alt="ChitChat Features"
            className="w-full max-w-md mix-blend-multiply"
          />
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      {/* Add custom animation for marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;





