import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

type UserType = "student" | "mentor";
type Mode = "login" | "signup";

const Login = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userType, setUserType] = useState<UserType>("mentor");
  const [mode, setMode] = useState<Mode>("login");
  const navigate = useNavigate();

  const storePhone = (phone: string, type: UserType) => {
    if (type === "student") {
      localStorage.setItem("usernumber", phone);
    } else {
      localStorage.setItem(type, phone);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (phoneNumber.length !== 10) {
      setErrorMsg(t('auth.invalidPhone'));
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(t('auth.invalidPassword'));
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        { mobile: phoneNumber, password, userType }
      );

      if (res.data?.success) {
        storePhone(phoneNumber, userType);
        navigate(`/dashboard/${userType}`);
      } else {
        setErrorMsg(res.data?.message || "Something went wrong");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const phoneFromUrl = searchParams.get("phone");
    const typeFromUrl = searchParams.get("type");

    if (phoneFromUrl && phoneFromUrl.length === 10) {
      setPhoneNumber(phoneFromUrl);
    }

    if (typeFromUrl === "mentor" || typeFromUrl === "student") {
      setUserType(typeFromUrl);
    }
  }, [searchParams]);

  const renderForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('auth.phone')}</Label>
        <Input
          type="text"
          maxLength={10}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          placeholder={t('auth.phone')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('auth.password')}</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "Create a password" : "Enter password"}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <Button
        className="w-full bg-hommentor-blue hover:bg-hommentor-darkBlue"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading
          ? "..."
          : mode === "signup" ? t('auth.signupBtn') : t('auth.loginBtn')}
      </Button>

      <p className="text-sm text-center text-gray-600">
        {mode === "login" ? (
          <>
            <button
              type="button"
              className="text-hommentor-blue underline"
              onClick={() => { setMode("signup"); setErrorMsg(""); }}
            >
              {t('auth.signupTab')}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="text-hommentor-blue underline"
              onClick={() => { setMode("login"); setErrorMsg(""); }}
            >
              {t('auth.loginTab')}
            </button>
          </>
        )}
      </p>
    </div>
  );

  return (
    <Layout>
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "signup" ? t('auth.signupTitle') : t('auth.loginTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={userType}
            value={userType}
            onValueChange={(val) => {
              setUserType(val as UserType);
              setPhoneNumber("");
              setPassword("");
              setErrorMsg("");
            }}
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="student">{t('auth.parent')}</TabsTrigger>
              <TabsTrigger value="mentor">{t('auth.mentor')}</TabsTrigger>
            </TabsList>

            <TabsContent value="student">{renderForm()}</TabsContent>
            <TabsContent value="mentor">{renderForm()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Login;
