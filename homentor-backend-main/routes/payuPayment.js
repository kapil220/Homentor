const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const User = require("../models/User");
const { applyPaymentSuccess } = require("../utils/postPaymentSuccess");

const router = express.Router();

const PAYU_MODE = (process.env.PAYU_MODE || "test").toLowerCase();
const PAYU_BASE = PAYU_MODE === "prod"
    ? "https://secure.payu.in"
    : "https://test.payu.in";
const PAYU_INFO_BASE = PAYU_MODE === "prod"
    ? "https://info.payu.in"
    : "https://test.payu.in";

function buildHash(params, salt, saltVersion) {
    const {
        key, txnid, amount, productinfo, firstname, email,
        udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = ""
    } = params;

    const hashString = [
        key, txnid, amount, productinfo, firstname, email,
        udf1, udf2, udf3, udf4, udf5,
        "", "", "", "", "",
        salt
    ].join("|");

    const algo = saltVersion === "2" ? "sha512" : "sha512";
    return crypto.createHash(algo).update(hashString).digest("hex");
}

function buildVerifyHash(key, command, var1, salt) {
    return crypto.createHash("sha512").update(`${key}|${command}|${var1}|${salt}`).digest("hex");
}

router.post("/create-order", async (req, res) => {
    try {
        const { amount, customerId, customerPhone, mentorId, duration, session, isDemo, classBookingId } = req.body;

        const key = process.env.PAYU_MERCHANT_KEY;
        const salt = process.env.PAYU_MERCHANT_SALT;
        const saltVersion = process.env.PAYU_SALT_VERSION || "1";

        if (!key || !salt) {
            return res.status(500).json({ message: "PayU credentials not configured" });
        }

        const user = await User.findOne({ phone: customerPhone });
        if (!user) return res.status(404).json({ message: "User not found" });

        const txnid = `HMT${Date.now()}${uuidv4().slice(0, 6)}`;
        const amountStr = Number(amount).toFixed(2);
        const productinfo = isDemo ? "Homentor Demo Session" : "Homentor Class Booking";
        const firstname = (user.name || customerId || "Homentor").toString().slice(0, 60);
        const email = user.email || `${customerPhone}@homentor.in`;

        const hashParams = {
            key, txnid, amount: amountStr, productinfo, firstname, email
        };
        const hash = buildHash(hashParams, salt, saltVersion);

        await Order.create({
            orderId: txnid,
            parent: user._id,
            amount,
            userPhone: customerPhone,
            status: "PENDING",
            mentor: mentorId,
            duration: duration ? duration : null,
            session: session ? session : 1,
            isDemo: !!isDemo,
            classBookig: classBookingId ? classBookingId : null,
            paymentProvider: "payu"
        });

        const frontendBase = (process.env.FRONTEND_BASE_URL || "https://homentor.in").replace(/\/$/, "");
        const returnUrl = `${frontendBase}/payment-status?orderId=${txnid}`;

        res.status(200).json({
            // normalized fields used by the frontend
            order_id: txnid,
            provider: "payu",
            action: `${PAYU_BASE}/_payment`,
            payload: {
                key,
                txnid,
                amount: amountStr,
                productinfo,
                firstname,
                email,
                phone: customerPhone,
                surl: returnUrl,
                furl: returnUrl,
                hash
            }
        });
    } catch (error) {
        console.error("PayU create-order error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create PayU order",
            error: error.response?.data || error.message
        });
    }
});

router.get("/verify-order/:id", async (req, res) => {
    try {
        const txnid = req.params.id;
        const key = process.env.PAYU_MERCHANT_KEY;
        const salt = process.env.PAYU_MERCHANT_SALT;

        const oldOrder = await Order.findOne({ orderId: txnid })
            .populate("mentor", "fullName phone teachingModes")
            .populate("parent", "phone");

        if (!oldOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        const command = "verify_payment";
        const hash = buildVerifyHash(key, command, txnid, salt);

        const formBody = qs.stringify({ key, command, var1: txnid, hash });
        const response = await axios.post(
            `${PAYU_INFO_BASE}/merchant/postservice.php?form=2`,
            formBody,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const payuData = response.data;
        const txnDetails = payuData?.transaction_details?.[txnid] || {};
        const payuStatus = (txnDetails.status || payuData?.status_code || "").toString().toLowerCase();

        let normalizedStatus;
        if (payuStatus === "success" || payuStatus === "captured") {
            normalizedStatus = "SUCCESS";
            if (oldOrder.status !== "success") {
                await applyPaymentSuccess(oldOrder);
            }
        } else if (payuStatus === "pending" || payuStatus === "in progress" || payuStatus === "inprogress") {
            normalizedStatus = "PENDING";
            oldOrder.status = "pending";
        } else {
            normalizedStatus = "FAILED";
            oldOrder.status = "failed";
        }
        oldOrder.verifiedAt = new Date();
        await oldOrder.save();

        // Shape the response to match what the success page already consumes
        // (an array of transactions with payment_status + order_amount).
        res.status(200).json([
            {
                payment_status: normalizedStatus,
                order_amount: oldOrder.amount,
                order_id: txnid,
                payu_raw: txnDetails
            }
        ]);
    } catch (error) {
        console.error("PayU verify error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to verify PayU order",
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
