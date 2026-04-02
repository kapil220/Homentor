// components/MentorCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MentorCard from "./MentorCard";
import TornCard from "./TornCard";

export default function MentorCarousel({ mentors }) {
  const premiumMentors = mentors; // adjust key as needed

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        ⭐ Premium Mentors
      </h2>

      <div className="relative w-[100%]">
        {/* Custom Navigation Buttons */}
        <button
          className="swiper-button-prev  absolute top-1/2 left-0 z-10 -translate-y-1/2  p-2 rounded-full shadow hover:bg-indigo-100"
          id="prevBtn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
            fill="none"
            viewBox="0 0 14 14"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: "#prevBtn",
            nextEl: "#nextBtn",
          }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3 },
          }}
          loop={true}
          className=""
        >
          {premiumMentors.map((mentor) => (
            <SwiperSlide key={mentor.id}>
              <TornCard ></TornCard>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="swiper-button-next absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-indigo-100"
          id="nextBtn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
