import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, BadgeCheck } from "lucide-react";
import TiltCard from "@/comp/TiltCard";

type Mentor = {
  _id: string;
  fullName: string;
  profilePhoto?: string;
  rating?: number;
  experience?: string;
  subjects?: string[];
  category?: string;
  teachingModes?: { homeTuition?: { monthlyPrice?: number; margin?: number } };
};

const FeaturedMentorsSection = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mentor/visible-mentors`
        );
        // Endpoint returns { success, count, mentors, mode }
        const list: Mentor[] =
          res.data?.mentors || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        // Sort by rating desc and take top 6
        const top = [...list]
          .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
          .slice(0, 6);
        setMentors(top);
      } catch (err) {
        console.warn("Featured mentors load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!loading && mentors.length === 0) return null;

  return (
    <section className="py-24 bg-homentor-mist relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Featured Mentors</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
            Top-rated, hand-picked, verified
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            A small sample from our curated mentor network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? Array.from({ length: 6 }) : mentors).map((m: any, i: number) => (
            <motion.div
              key={m?._id || i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 h-56 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-slate-100 mb-3" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
              ) : (
                <TiltCard intensity={5}>
                  <MentorCard mentor={m} />
                </TiltCard>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link to="/mentors">
            <Button
              size="lg"
              className="bg-homentor-ink hover:bg-slate-800 text-white rounded-xl shadow-xl h-12 px-7"
            >
              Browse all mentors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const MentorCard = ({ mentor }: { mentor: Mentor }) => {
  const monthly =
    Number(mentor?.teachingModes?.homeTuition?.monthlyPrice || 0) +
    Number(mentor?.teachingModes?.homeTuition?.margin || 0);
  const subjects = (mentor.subjects || []).slice(0, 3);
  const rating = Number(mentor.rating) || 4.5;

  return (
    <Link
      to={`/mentors/${mentor.fullName}`}
      onClick={() => {
        try {
          localStorage.setItem("mentorDetail", JSON.stringify(mentor));
        } catch {
          /* ignore */
        }
      }}
      className="block group rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-xl hover:border-blue-200 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={mentor.profilePhoto || "/placeholder.svg"}
            alt={mentor.fullName}
            className="w-16 h-16 rounded-full object-cover border border-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 bg-homentor-blue text-white rounded-full p-1">
            <BadgeCheck className="w-3 h-3" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-homentor-blue transition-colors">
            {mentor.fullName}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
            {mentor.experience && (
              <span className="text-xs text-slate-500 ml-2 truncate">
                · {mentor.experience}
              </span>
            )}
          </div>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-full bg-blue-50 text-homentor-blue border border-blue-100"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm">
          <span className="font-bold text-slate-900">
            {monthly ? `₹${monthly.toLocaleString()}` : "—"}
          </span>{" "}
          <span className="text-slate-500 text-xs">/ month</span>
        </p>
        <span className="text-sm text-homentor-blue font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
          View profile <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default FeaturedMentorsSection;
