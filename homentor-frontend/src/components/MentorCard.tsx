import React, { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, PhoneCall, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MentorProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  hourlyRate: number;
  classLevel: string;
  subjects?: string[];
  availability?: string;
}

interface MentorCardProps {
  mentor: MentorProps;
  className?: string;
}
const MentorCard = forwardRef<HTMLDivElement, MentorCardProps>(
  ({ mentor, className }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-500 hover:shadow-card-hover border-2 border-transparent hover:border-homentor-blue relative backdrop-blur-sm group/card animate-rotate",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-homentor-lightBlue/10 before:to-homentor-book/10 before:rounded-lg before:opacity-0 group-hover/card:before:opacity-100 before:transition-opacity before:duration-500",
          "after:absolute after:inset-0 after:bg-white after:rounded-lg after:z-[-1] dark:after:bg-gray-900",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group/image perspective-card">
          <div className={cn(
            "w-full h-48 overflow-hidden transition-all duration-700",
            "clip-path-hexagon transform-gpu",
            isHovered ? "scale-105 rotate-hexagon" : ""
          )}>
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-homentor-blue/20 to-homentor-book/20 blur-xl transition-opacity duration-500 z-[-1]",
            isHovered ? "opacity-70" : "opacity-0"
          )}></div>
          
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-white/90 backdrop-blur-sm text-black font-semibold px-2 py-1 flex items-center gap-1 shadow-lg transform-gpu transition-transform duration-300 hover:scale-110">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {mentor.rating}
            </Badge>
          </div>
          
          {mentor.availability && (
            <Badge className="absolute bottom-2 left-2 z-10 bg-green-100/90 backdrop-blur-sm text-green-800 px-2 py-1 shadow-lg transform-gpu transition-transform duration-300 hover:scale-110">
              {mentor.availability}
            </Badge>
          )}
        </div>

        <CardContent className="p-5 space-y-4 relative z-10">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-homentor-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-homentor-book/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          {/* Mentor details */}
          <div className="relative">
            <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-homentor-blue to-homentor-book bg-clip-text text-transparent">{mentor.name}</h3>
            <p className="text-lg font-semibold text-homentor-blue">
              ₹{mentor.hourlyRate}/month
            </p>
            {/* <p className="text-sm text-gray-600">Class: {mentor.classLevel}</p>
            
            {mentor.subjects && mentor.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.subjects.slice(0, 2).map((subject, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-homentor-blue/10 to-homentor-book/10 border-transparent hover:from-homentor-blue/20 hover:to-homentor-book/20 transition-colors duration-300"
                  >
                    {subject}
                  </Badge>
                ))}
                {mentor.subjects.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-homentor-blue/10 to-homentor-book/10 border-transparent hover:from-homentor-blue/20 hover:to-homentor-book/20 transition-colors duration-300"
                  >
                    +{mentor.subjects.length - 2}
                  </Badge>
                )}
              </div>
            )} */}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Link to={`/mentors/${mentor.id}`} className="w-full overflow-hidden rounded-md group/btn relative">
              <Button 
                className="w-full bg-gradient-to-r from-homentor-blue to-homentor-darkBlue hover:from-homentor-darkBlue hover:to-homentor-blue transition-all duration-500 overflow-hidden relative z-10"
              >
                <span className="relative z-10">View Profile</span>
                <span className="absolute inset-0 bg-white/20 transform-gpu -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></span>
              </Button>
            </Link>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                className="bg-gradient-to-r from-homentor-chat to-homentor-chatHover hover:from-homentor-chatHover hover:to-homentor-chat transition-all duration-300 flex items-center justify-center gap-1 group/icon overflow-hidden relative"
                title="Chat with mentor"
              >
                <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110" />
                <span className="hidden sm:inline">Chat</span>
                <span className="absolute inset-0 bg-white/10 transform-gpu -translate-x-full group-hover/icon:translate-x-0 transition-transform duration-500"></span>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-homentor-call to-homentor-callHover hover:from-homentor-callHover hover:to-homentor-call transition-all duration-300 flex items-center justify-center gap-1 group/icon overflow-hidden relative" 
                title="Call mentor"
              >
                <PhoneCall className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110" />
                <span className="hidden sm:inline">Call</span>
                <span className="absolute inset-0 bg-white/10 transform-gpu -translate-x-full group-hover/icon:translate-x-0 transition-transform duration-500"></span>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-homentor-book to-homentor-bookHover hover:from-homentor-bookHover hover:to-homentor-book transition-all duration-300 flex items-center justify-center gap-1 group/icon overflow-hidden relative" 
                title="Book a session"
              >
                <CalendarPlus className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110" />
                <span className="hidden sm:inline">Book</span>
                <span className="absolute inset-0 bg-white/10 transform-gpu -translate-x-full group-hover/icon:translate-x-0 transition-transform duration-500"></span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

MentorCard.displayName = "MentorCard";

export default MentorCard;