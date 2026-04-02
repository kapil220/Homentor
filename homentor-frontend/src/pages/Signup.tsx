import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import TutorApplicationForm from '@/pages/TutorApplicationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, Users } from 'lucide-react';

const TutorApplicationPage: React.FC = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const [showForm, setShowForm] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br mt-[8vh] from-blue-100 via-blue-50 to-yellow-50 py-12 px-2  lg:px-8">
        <div className="max-w-4xl mx-auto">
          {!showForm ? (
            <>
              <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-blue-700">Become a HOMENTOR Tutor</h1>
                <p className="mt-4 text-xl text-blue-600">
                  Join our community of passionate educators and make a difference in students' lives.
                </p>
              </header>

              <section className="mb-12">
                <Card className="bg-white shadow-xl border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-3xl text-blue-700">Why Join HOMENTOR?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-blue-700">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">Flexible Schedule</h3>
                        <p className="text-sm">Tutor at your own convenience. Set your availability and manage your sessions easily.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">Supportive Community</h3>
                        <p className="text-sm">Connect with fellow tutors, share resources, and grow professionally.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">Verified Platform</h3>
                        <p className="text-sm">We ensure a safe and reliable environment for both tutors and students.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="mb-12">
                <Card className="bg-white shadow-xl border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-3xl text-blue-700">Our Policy & Commitment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-blue-700">
                    <p>
                      At HOMENTOR, we are committed to providing high-quality education and fostering a positive learning environment.
                      Our tutors are expected to uphold the highest standards of professionalism, integrity, and dedication to student success.
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>Maintain a professional and respectful demeanor at all times.</li>
                      <li>Prepare adequately for each tutoring session.</li>
                      <li>Provide constructive feedback and support to students.</li>
                      <li>Adhere to HOMENTOR's code of conduct and privacy policies.</li>
                      <li>Commit to continuous improvement and professional development.</li>
                    </ul>
                    <p className="font-semibold">
                      By applying, you agree to read and abide by our full <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">Terms & Conditions for Tutors</a>.
                    </p>
                  </CardContent>
                </Card>
              </section>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-4 px-8 text-xl shadow-lg transform hover:scale-105 transition-transform duration-150"
                  onClick={() => setShowForm(true)}
                >
                  Apply Now to Become a Tutor
                </Button>
              </div>
            </>
          ) : (
            <TutorApplicationForm />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TutorApplicationPage;