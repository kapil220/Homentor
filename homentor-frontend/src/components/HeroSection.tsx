import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, GraduationCap, School, Users } from "lucide-react";
import AnimatedSpheres from "@/components/AnimatedSpheres";
import axios from "axios";

const HeroSection = ({
  title = "Your Child Deserves a Mentor, Not Just a Teacher",
  description = "Get matched with trusted tutors and subject mentors who provide customized learning plans based on your academic needs.",
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax effect calculations
  const heroTextTransform = `translateY(${scrollY * 0.1}px)`;
  const heroImageTransform = `translateY(${scrollY * 0.05}px)`;
  const decorativeElementTransform = `translateY(${scrollY * -0.08}px)`;
  // Logo colors
  const logoBlue = "#1E90FF";
  const logoGold = "#FFD700";
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden min-h-[100vh] flex items-center">
      {/* Background parallax elements */}
      <div
        className="absolute inset-0 hero-gradient -z-10"
        style={{ transform: `translateY(${scrollY * 0.03}px)` }}
      />
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent -z-10" />

      {/* Floating decorative elements */}
      <div
        className="absolute -top-10 right-10 bg-homentor-lightBlue rounded-full h-40 w-40 opacity-60 animate-pulse-soft"
        style={{ transform: decorativeElementTransform }}
      />
      <div
        className="absolute top-32 left-10 bg-homentor-lightGold rounded-full h-20 w-20 opacity-50 animate-pulse-soft"
        style={{
          transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * 0.05
            }deg)`,
        }}
      />
      <div
        className="absolute bottom-20 right-20 bg-homentor-lightBlue rounded-full h-24 w-24 opacity-40 animate-pulse-soft"
        style={{ transform: `translateY(${scrollY * -0.12}px)` }}
      />

      <div className="container-tight py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8" style={{ transform: heroTextTransform }}>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight animate-fade-in">
              {title.split(" ").map((word, i) => (
                <span key={i}>
                  {word.toLowerCase() === "mentor," ? (
                    <span className="text-homentor-blue relative">
                      {word}{" "}
                      <span className="absolute bottom-1 left-0 w-full h-2 bg-homentor-gold opacity-30 -z-10 transform -rotate-1"></span>
                    </span>
                  ) : (
                    word + " "
                  )}
                </span>
              ))}
            </h1>
            <p
              className="text-lg text-gray-700 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {description}
            </p>
            <div
              onClick={() => navigate("/mentors")}
              // onClick={() => sendWhatsappMessage()}
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div
                className="w-[75%] lg:w-[50%] cursor-pointer bg-homentor-gold rounded-lg p-4 shadow-lg animate-scale-up"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white rounded-full p-2">
                    <Star className="h-6 w-6 text-homentor-gold fill-current" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Book A Mentor</p>
                    {/* <p className="text-gray-800">students & parents</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative h-[500px]">
            {/* Animated spheres with key points */}
            <div
              className="relative w-full h-full animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <AnimatedSpheres />
            </div>
          </div>
        </div>
      </div>

      {/* SVG wave divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1">
        <svg
          className="relative block w-full h-24 transform"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
