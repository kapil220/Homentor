import Layout from '@/components/Layout'
import React from 'react'
import { useEffect  } from 'react'


function ContactUs() {
    useEffect(()=>{ window.scrollTo(0,0) },[])

  return (
    <Layout>
    
      <div className="mt-14 bg-gray-100">
  {/* Header Section */}
  <div className="container mx-auto px-4 py-12 text-center">
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
      HOMENTOR CONTACT & SUPPORT
    </h2>
    <p className="mt-4 text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
      After raising a support ticket, please give us 24 hours and our customer support representative will reach out to you via Phone Call.
    </p>
  </div>

  {/* Contact Info Section */}
  <div className="container mx-auto px-4 pb-12">
    <div className="flex flex-col md:flex-row md:justify-between gap-8">
      
      {/* Contact Number */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Contact Number</h3>
        <p className="text-lg font-bold text-blue-700">+91 7748833998</p>
      </div>

      {/* Email */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Email</h3>
        <p className="text-lg font-bold text-blue-700">contact@homentor.in</p>
      </div>

      {/* Address */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Address</h3>
        <p className="text-base md:text-lg text-gray-700">
          22 - Scheme No. 54, PU-4, Vijay Nagar, Indore - 452010, MP
        </p>
      </div>

    </div>
  </div>
</div>

    
    
    </Layout>
  )
}

export default ContactUs