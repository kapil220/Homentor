const express = require("express");
const axios = require("axios");
const CallIntent = require("../models/CallIntent");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");
const Admin = require("../models/Admin");

const CallLog = require("../models/CallLog");
const router = express.Router();
const xml2js = require("xml2js");
const syncExotelCalls = require("../utils/syncExotelCalls");


router.get("/exotel-calls", async (req, res) => {
  try {
    const {
      EXOTEL_API_KEY,
      EXOTEL_API_TOKEN,
      EXOTEL_ACCOUNT_SID
    } = process.env;

    if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_ACCOUNT_SID) {
      return res.status(500).json({
        success: false,
        message: "Exotel environment variables missing"
      });
    }

    // 🇮🇳 Mumbai cluster (use this for India accounts)
    const BASE_URL = "https://ccm-api.exotel.com";
    const BASE_URL2 = "https://api.exotel.com";
    const url = `${BASE_URL2}/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls`;

    const response = await axios.get(url, {
      auth: {
        username: EXOTEL_API_KEY,
        password: EXOTEL_API_TOKEN
      },
      params: {
        PageSize: pageSize,
        SortBy: "DateCreated:desc"
      }
    });

    // 🔄 Convert XML → JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const calls =
      result?.TwilioResponse?.Call
        ? Array.isArray(result.TwilioResponse.Call)
          ? result.TwilioResponse.Call
          : [result.TwilioResponse.Call]
        : [];

    res.json({
      success: true,
      count: calls.length,
      calls,
    });

  } catch (error) {
    console.error("❌ Exotel fetch error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

router.post("/sync-call-logs", async (req, res) => {
  try {
    const count = await syncExotelCalls();
    res.json({
      success: true,
      message: "Call logs synced",
      count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.post("/call/initiate", async (req, res) => {
  try {
    const { parentPhone, mentorId, mentorPhone, mentorName, mode } = req.body;

    if (!mentorPhone) {
      return res.status(400).json({ success: false, message: "mentorPhone is required" });
    }

    const intent = await CallIntent.create({
      parentPhone: parentPhone ? String(parentPhone) : "anonymous",
      mentorId: mentorId || undefined,
      mentorPhone: String(mentorPhone),
      mentorName,
      mode: mode === "direct" ? "direct" : "exotel",
      createdAt: new Date(),
      statusCallbackUrl: "https://homentor-backend.onrender.com/api/exotel/call-status",
    });

    return res.json({ success: true, data: intent });
  } catch (err) {
    console.error("call/initiate error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

function normalizePhone(phone) {
  if (!phone) return null;
  return phone
    .toString()
    .replace(/\D/g, "")     // remove non-digits
    .replace(/^0+/, "")     // remove leading zeros
    .slice(-10);            // keep last 10 digits
}

router.get("/get-mentor-number", async (req, res) => {
  try {
    const rawParentNumber =
      req.query.From ||
      req.body.From ||
      req.body.from ||
      "";

    const parentNumber = normalizePhone(rawParentNumber); // last 10 digits
    console.log("Exotel webhook — raw:", rawParentNumber, "normalised:", parentNumber);

    // Exotel may send +919876543210, 09876543210, or 9876543210.
    // We store intents with a leading-0 prefix (09876543210).
    // Match any of the three formats so we never miss an intent.
    const intent = await CallIntent.findOne({
      parentPhone: {
        $in: [
          rawParentNumber,
          parentNumber,
          `0${parentNumber}`,
        ],
      },
    }).sort({ createdAt: -1 });

    console.log("intent found:", intent?._id || "NONE");

    if (!intent) {
      console.error("No CallIntent found for", rawParentNumber);
      // Return a safe fallback so Exotel doesn't get a 500
      res.set("Content-Type", "text/xml");
      return res.send(`<Response><Reject/></Response>`);
    }

    // Fetch Exotel platform number so mentor sees it as caller ID
    const adminDoc = await Admin.findOne().sort({ _id: -1 }).lean();
    const exotelCallerId = adminDoc?.callingNo ? String(adminDoc.callingNo) : "07314626521";

    // Update lead statuses (non-fatal if they don't exist)
    const [lead, parentLead] = await Promise.all([
      MentorLead.findOne({ phone: intent.mentorPhone }),
      ParentLead.findOne({ phone: parentNumber }),
    ]);

    if (parentLead) {
      parentLead.isCalled = true;
      parentLead.status = "call_done";
      parentLead.lastActive = new Date();
      parentLead.lastActivityText = "Called Mentor";
      await parentLead.save();
    }
    if (lead) {
      lead.isCalled = true;
      lead.status = "call_done";
      await lead.save();
    }

    res.set("Content-Type", "text/xml");
    res.send(`<Response><Dial callerId="${exotelCallerId}">${intent.mentorPhone}</Dial></Response>`);
  } catch (err) {
    console.error("get-mentor-number webhook error:", err.message);
    res.set("Content-Type", "text/xml");
    res.send(`<Response><Reject/></Response>`);
  }
});

router.post("/call-status", async (req, res) => {
  try {
    const data = req.body;
    console.log("📞 Exotel Call Status:", data);

    const callSid = data.CallSid || data.call_sid;
    const status = data.CallStatus || data.Status;
    const duration = data.Duration ? Number(data.Duration) : 0;
    const recordingUrl = data.RecordingUrl;
    const disconnectReason = data.DisconnectReason;
    const parentPhone = normalizePhone(data.From);
    const mentorPhone = normalizePhone(data.To);

    // 🔍 Find existing log or create new
    let callLog = await CallLog.findOne({ callSid });

    if (!callLog) {
      callLog = new CallLog({
        callSid,
        parentPhone,
        mentorPhone,
      });
    }

    callLog.status = status;
    callLog.duration = duration || callLog.duration;
    callLog.recordingUrl = recordingUrl || callLog.recordingUrl;
    callLog.disconnectReason = disconnectReason;
    callLog.rawExotelData = data;

    await callLog.save();

    // 🔁 OPTIONAL: update CallIntent (if still exists)
    if (parentPhone) {
      const intent = await CallIntent.findOne({
        parentPhone,
      }).sort({ createdAt: -1 });

      if (intent) {
        intent.status =
          status === "completed" ? "connected" : "failed";
        await intent.save();
      }
    }

    // 🚨 ALWAYS 200 for Exotel
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ CallLog Error:", err);
    res.sendStatus(200);
  }
});



module.exports = router;
