import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams  } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import axios from "axios";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"student" | "mentor">("mentor");

  const [verificationId, setVerificationId] = useState("");

  const handlePhoneSubmit = () => {
    try {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/otp/send-otp`, {
          mobile: phoneNumber,
          userType : userType
        })
        .then((res) => {
          console.log(res.data);
          setVerificationId(res.data.verificationId);
          setOtpSent(true)
        });
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };
  const handleOtpVerify = async() => {
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify-otp`, {
      verificationId,
      code: otp,
      phone: phoneNumber,
      userType : userType
    });
    if(userType == "student"){
      localStorage.setItem(`usernumber`, phoneNumber)
    } else {
      localStorage.setItem(`${userType}`, phoneNumber)
    }
    
    console.log('OTP verified:', otp, 'for phone:', phoneNumber);
    console.log(res)
    navigate(`/dashboard/${userType}`);
    // Here you would typically verify the OTP with your backend
  };
  const navigate = useNavigate();

  useEffect(() => {
    const phoneFromUrl = searchParams.get("phone");
    const typeFromUrl = searchParams.get("type");

    if (phoneFromUrl && phoneFromUrl.length === 10) {
      setPhoneNumber(phoneFromUrl);
    }

    if (typeFromUrl === "mentor" || typeFromUrl === "student") {
      setUserType(typeFromUrl);
    }
    console.log(userType)
  }, [searchParams]);
  

  return (
    <Layout>
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to Homentor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={userType}
            onValueChange={(val) => {
              setUserType(val as "student" | "mentor");
              setOtpSent(false);
              setPhoneNumber("");
              setOTP("");
            }}
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="mentor">Mentor</TabsTrigger>
            </TabsList>

            {/* Login Tab Content */}
            <TabsContent value="student">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="text"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit number"
                  />
                </div>

                {!otpSent ? (
                  <Button
                    className="w-full bg-homentor-blue hover:bg-homentor-darkBlue"
                    onClick={handlePhoneSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <Input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        placeholder="6-digit OTP"
                      />
                    </div>
                    <Button
                      className="w-full bg-homentor-blue hover:bg-homentor-darkBlue"
                      onClick={handleOtpVerify}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mentor">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="text"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit number"
                  />
                </div>

                {!otpSent ? (
                  <Button
                    className="w-full bg-homentor-blue hover:bg-homentor-darkBlue"
                    onClick={handlePhoneSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <Input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        placeholder="6-digit OTP"
                      />
                    </div>
                    <Button
                      className="w-full bg-homentor-blue hover:bg-homentor-darkBlue"
                      onClick={handleOtpVerify}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Login;
