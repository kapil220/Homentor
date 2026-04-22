const ClassBooking = require("../models/ClassBooking");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");

async function applyPaymentSuccess(oldOrder) {
    oldOrder.status = "success";

    const lead = await MentorLead.findOne({ phone: oldOrder.mentor.phone });
    if (lead) {
        lead.paidBooked = true;
        lead.status = "paid_booking";
        await lead.save();
    }

    const parentLead = await ParentLead.findOne({ phone: oldOrder.parent.phone });
    if (parentLead) {
        parentLead.paidBooked = true;
        parentLead.status = "paid_booking";
        parentLead.lastActive = new Date();
        parentLead.lastActivityText = "Class Booking";
        await parentLead.save();
    }

    const margin = oldOrder?.mentor?.teachingModes?.homeTuition?.margin;
    const monthlyPrice = oldOrder?.mentor?.teachingModes?.homeTuition?.monthlyPrice;
    const duration = oldOrder.duration ? oldOrder.duration : 22;

    if (oldOrder.isDemo) {
        const oldBooking = await ClassBooking.findOne({ _id: oldOrder.classBookig });
        oldBooking.sessionContinued = true;
        await oldBooking.save();

        const newBooking = new ClassBooking({
            mentor: oldOrder.mentor._id,
            price: oldOrder.amount,
            parent: oldOrder.parent._id,
            duration,
            session: oldOrder?.session,
            commissionPrice: margin,
            currentPerClassPrice: monthlyPrice / oldOrder?.duration,
            remainingClasses: duration
        });
        newBooking.isDemo = false;
        newBooking.status = "scheduled";
        newBooking.class = oldBooking.class;
        newBooking.studentName = oldBooking.studentName;
        newBooking.school = oldBooking.school;
        newBooking.scheduledTime = oldBooking.scheduledTime;
        newBooking.scheduledDate = oldBooking.scheduledDate;
        newBooking.subject = oldBooking.subject;
        newBooking.demoStatus = "session_continued";
        await newBooking.save();
    } else if (oldOrder.classBookig) {
        const oldClassBooking = await ClassBooking.findById(oldOrder.classBookig);
        oldClassBooking.sessionContinued = true;

        const newBooking = new ClassBooking({
            mentor: oldOrder.mentor._id,
            price: oldOrder.amount,
            parent: oldOrder.parent._id,
            duration,
            session: oldOrder?.session,
            commissionPrice: margin,
            currentPerClassPrice: monthlyPrice / oldOrder?.duration,
            remainingClasses: duration
        });
        newBooking.isDemo = false;
        newBooking.status = "scheduled";
        newBooking.class = oldClassBooking.class;
        newBooking.studentName = oldClassBooking.studentName;
        newBooking.school = oldClassBooking.school;
        newBooking.scheduledTime = oldClassBooking.scheduledTime;
        newBooking.scheduledDate = oldClassBooking.scheduledDate;
        newBooking.subject = oldClassBooking.subject;
        newBooking.demoStatus = "session_continued";
        await oldClassBooking.save();
        await newBooking.save();
    } else {
        const newBooking = new ClassBooking({
            mentor: oldOrder.mentor._id,
            price: oldOrder.amount,
            parent: oldOrder.parent._id,
            duration,
            session: oldOrder?.session,
            commissionPrice: margin,
            currentPerClassPrice: monthlyPrice / oldOrder?.duration,
            remainingClasses: duration
        });
        await newBooking.save();
    }
}

module.exports = { applyPaymentSuccess };
