import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import LeadsTab from "@/comp/LeadsTab";

const MentorLeads = () => {
  const { t } = useLanguage();
  const phone = localStorage.getItem("mentor");

  useEffect(() => {
    if (!phone) return;
    axios
      .patch(`${import.meta.env.VITE_API_BASE_URL}/teacher-leads/mark-seen`, null, {
        headers: { "x-mentor-phone": phone },
      })
      .catch(() => {});
  }, [phone]);

  return (
    <DashboardLayout
      role="mentor"
      title={t('mentorDashboard.leads')}
      subtitle={t('mentorDashboard.leadsSubtitle')}
    >
      <div className="bg-white rounded-xl border border-gray-200">
        <LeadsTab mentorPhone={phone} />
      </div>
    </DashboardLayout>
  );
};

export default MentorLeads;
