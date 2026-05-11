import DashboardLayout from "@/components/DashboardLayout";
import LeadsTab from "@/comp/LeadsTab";

const MentorLeads = () => {
  const phone = localStorage.getItem("mentor");

  return (
    <DashboardLayout
      role="mentor"
      title="Leads"
      subtitle="Pay the commission to reveal a parent's phone number and address"
    >
      <div className="bg-white rounded-xl border border-gray-200">
        <LeadsTab mentorPhone={phone} />
      </div>
    </DashboardLayout>
  );
};

export default MentorLeads;
