import Layout from "@/components/Layout";
import React, { useEffect } from "react";

function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <Layout>
      <div className="mt-14 text-center">
        {/* Mission Section */}
        <div className="flex flex-col items-center bg-[#FDEDEC] py-12 px-4 md:px-0">
          <div className="max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold leading-snug">
              Bringing the{" "}
              <span className="text-blue-700">highest quality teachers,</span>{" "}
              to support every child's educational ambitions
            </h2>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-700">
              Our mission is clear: Bring the best teachers worldwide into our
              community, arm them with top-notch resources, and empower them to
              create personalized learning experiences for each student.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center pt-12 pb-16 px-4 md:px-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-10">What We Value</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-[#001b2e] text-white rounded-xl p-6 border-t-2 border-l-4 border-r-10 border-b-10 border-[#FFEFDB]">
              <h4 className="font-bold text-xl mb-4">High-quality execution</h4>
              <p className="text-base md:text-lg leading-relaxed">
                We are dedicated to upholding excellence in all aspects of our
                work, placing a strong emphasis on quality rather than quantity.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#001b2e] text-white rounded-xl p-6 border-t-2 border-l-4 border-r-10 border-b-10 border-[#FFEFDB]">
              <h4 className="font-bold text-xl mb-4">Customer-centric approach</h4>
              <p className="text-base md:text-lg leading-relaxed">
                We prioritize our customers, always aiming to exceed their
                expectations and leave a positive impression.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#001b2e] text-white rounded-xl p-6 border-t-2 border-l-4 border-r-10 border-b-10 border-[#FFEFDB]">
              <h4 className="font-bold text-xl mb-4">Ownership</h4>
              <p className="text-base md:text-lg leading-relaxed">
                We trust each person to take responsibility for their actions,
                understanding that their commitment directly impacts the team's
                success.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center py-16 px-4 md:px-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-12">Our Team</h1>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member 1 */}
            <div className="w-52 md:w-60">
              <div className="w-52 h-52 md:w-60 md:h-60 rounded-full bg-yellow-300 mx-auto overflow-hidden">
                <img
                  src=""
                  alt="Prashant Pansey"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl">Prashant Pansey</h3>
                <h5 className="text-gray-600">Founder & CEO</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}

export default AboutUs;
