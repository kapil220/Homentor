import Layout from "@/components/Layout";
import React from "react";
import { useEffect } from "react";

function Refund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
  <div
    style={{ backgroundColor: "rgb(245,247,250)" }}
    className="mt-14"
  >
    <div className="container">
      <div className="row p-0 m-0">
        <div className="col-12 py-5 text-center">
          <div style={{ fontSize: 38, fontWeight: 600 }}>
            REFUNDS
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="container">
    <div className="row justify-center">
      <div className="col-12 py-3">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 text-gray-700 space-y-4">
          <p className="text-base md:text-lg">
            At <strong>Homentor EDU Private Limited</strong>, we aim to provide a smooth learning experience. However, if a refund is requested, it will be processed according to the following policy:
          </p>

          <ul className="list-disc list-inside text-base md:text-lg space-y-2">
            <li>
              Refund requests must be submitted within <strong>3-5 business days</strong> from the date of the transaction.
            </li>
            <li>
              Refunds are calculated <strong>proportionally</strong> based on the sessions already used. Fees for sessions already conducted will be deducted from the total amount paid.
            </li>
            <li>
              Approved refunds will be processed back to the original payment method within <strong>3-5 business days</strong>.
            </li>
            <li>
              Taxes, transaction, or payment gateway charges may be deducted as applicable.
            </li>
            <li>
              Refunds are not applicable for sessions that have already been fully completed.
            </li>
          </ul>

          <p className="text-base md:text-lg">
            To request a refund, contact our support team at <strong>contact@homentor.in</strong> or call <strong>7748833998</strong> with your transaction and session details.
          </p>
        </div>
      </div>
    </div>
  </div>
</Layout>

  );
}

export default Refund;
