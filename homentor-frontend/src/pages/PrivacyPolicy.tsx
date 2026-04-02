import Layout from "@/components/Layout";
import React from "react";
import { useEffect } from "react";

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="mt-14 bg-gray-100">
  {/* Header Section */}
  <div className="container mx-auto px-4 py-12 text-center">
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
      Privacy Policy
    </h2>
  </div>

  {/* Privacy Policy Content */}
  <div className="container mx-auto px-4 pb-12">
    <div className="bg-white shadow-md rounded-lg p-6 md:p-10 text-gray-700 space-y-6 text-justify">

      {/* Introduction */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Introduction</h3>
        <p className="text-base md:text-lg leading-relaxed">
          This Privacy Policy describes how HOMENTOR EDU (OPC) PRIVATE LIMITED and its affiliates (collectively “HOMENTOR EDU (OPC) PRIVATE LIMITED, we, our, us”) collect, use, share, protect or otherwise process your personal data through our website <a href="https://homentor.in" className="text-blue-700 underline">https://homentor.in</a> (“Platform”). By visiting the Platform or availing any product/service, you agree to this Privacy Policy and the applicable Terms of Use.
        </p>
      </div>

      {/* Collection of Data */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Collection of Data</h3>
        <p className="text-base md:text-lg leading-relaxed">
          We collect personal data when you register or use our Platform, such as name, date of birth, address, contact details, payment information, and other sensitive data with your consent. You may choose not to provide information, but certain services/features may not be available without it.
        </p>
      </div>

      {/* Usage of Data */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Usage of Data</h3>
        <p className="text-base md:text-lg leading-relaxed">
          We use your data to provide services, enhance your experience, process transactions, resolve disputes, send updates/offers, detect fraud, enforce our Terms, and conduct research. Access to certain services may require your consent.
        </p>
      </div>

      {/* Sharing of Data */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Sharing of Data</h3>
        <p className="text-base md:text-lg leading-relaxed">
          We may share data with our affiliates, service providers, business partners, logistics partners, payment processors, and government authorities as required by law. You are advised to read third-party privacy policies when interacting with external platforms.
        </p>
      </div>

      {/* Security */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Security Precautions</h3>
        <p className="text-base md:text-lg leading-relaxed">
          We adopt reasonable security measures to protect your data. However, transmission over the internet cannot be guaranteed fully secure. Users are responsible for securing their login credentials.
        </p>
      </div>

      {/* Data Deletion and Retention */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Data Deletion and Retention</h3>
        <p className="text-base md:text-lg leading-relaxed">
          You may delete your account via profile settings or by contacting us. Certain data may be retained for legal or analytical purposes.
        </p>
      </div>

      {/* Consent and Rights */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Consent and Your Rights</h3>
        <p className="text-base md:text-lg leading-relaxed">
          By using the Platform, you consent to the collection and processing of your data. You may access, update, or withdraw consent by contacting the Grievance Officer. Withdrawal may restrict access to certain services.
        </p>
      </div>

      {/* Changes to Privacy Policy */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Changes to Privacy Policy</h3>
        <p className="text-base md:text-lg leading-relaxed">
          We may update this Privacy Policy periodically. Significant changes will be notified as required under applicable laws.
        </p>
      </div>

      {/* Grievance Officer */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">Grievance Officer</h3>
        <p className="text-base md:text-lg leading-relaxed">
          PRADHUMN RAGHUWANSHI, Director<br/>
          HOMENTOR EDU (OPC) PRIVATE LIMITED<br/>
          2 - Scheme No. 54, PU-4, Vijay Nagar, Indore - 452010, MP<br/>
          <strong>Contact:</strong>+91 9203149956 | <strong>Email:</strong> homentorindia@gmail.com<br/>
          <strong>Timings:</strong> Mon-Fri: 10:00–20:00, Sat-Sun: 10:00–18:00
        </p>
      </div>

    </div>
  </div>
</div>

    </Layout>
  );
}

export default PrivacyPolicy;
