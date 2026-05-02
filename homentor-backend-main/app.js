require('dotenv').config();
const express = require('express')
const cors = require('cors')
const connectDB = require('./configDB/db')

const startServer = async () => {
    // Essential environment variable check
    if (!process.env.MONGO_URI) {
        console.error('❌ CRITICAL ERROR: MONGO_URI is missing from environment variables.');
        console.error('The server cannot start without a database connection.');
        process.exit(1);
    }

    // Connect to Database
    await connectDB();

    const app = express()
    app.use(cors())
    app.use(express.json())

    // Routes
    app.use("/api/otp", require("./routes/otpRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/class-bookings", require('./routes/classBooking.js'));
    app.use("/api/class-records", require('./routes/classRecordRoutes.js'));
    app.use('/api/admin', require('./routes/adminRoutes'))
    app.use("/api/degrees", require('./routes/degreeRoutes.js'));
    app.use('/api/users', require('./routes/userRoutes'))
    app.use('/api', require('./routes/callMentor'))
    app.use('/api/mentor',require('./routes/mentorRoutes'))
    app.use("/api/payment", require("./routes/cashfreePayment.js"));
    app.use("/api/payu", require("./routes/payuPayment.js"));
    app.use("/api/cash-booking", require("./routes/cashBooking.js"));
    app.use("/api/order", require("./routes/orderRoutes.js"));
    app.use("/api/margin-rule", require("./routes/marginRule.js"));
    app.use("/api/demo-booking", require("./routes/demoBookingRoutes.js"));
    app.use('/api/notification', require("./routes/notification.js"))
    app.use('/api/whatsapp', require("./routes/whatsappRoutes.js"))
    app.use('/api/disclaimer', require("./routes/disclaimerRoutes.js"))
    app.use('/api/mentor-leads', require("./routes/mentorLeadRoutes.js"))
    app.use('/api/parent-leads', require("./routes/parentLeadRoutes.js"))
    app.use("/api/exotel", require("./routes/exotelCall.js"));
    app.use("/api/call-intent", require("./routes/callIntent.js"));
    app.use("/api/teacher-leads", require("./routes/teacherLeadRoutes.js"));
    app.use("/api/call-logs", require("./routes/callLogsRoutes.js"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
});