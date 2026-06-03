"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, Settings, Save } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "zamzam",
    supportEmail: "support@zamzam.com",
    maintenanceMode: false,
    orderNotifications: true,
    emailAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <Container>
      <div className="flex flex-col space-y-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">
                    Manage store configuration and preferences.
                </p>
            </div>
            <Button onClick={handleSave} disabled={loading} className="bg-zamzam-primary hover:bg-zamzam-secondary text-white">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" /> General Settings
                        </CardTitle>
                        <CardDescription>
                            Configure basic store information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input 
                                id="siteName" 
                                value={settings.siteName} 
                                onChange={(e) => handleChange("siteName", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input 
                                id="supportEmail" 
                                type="email"
                                value={settings.supportEmail} 
                                onChange={(e) => handleChange("supportEmail", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-gray-500">
                                    Temporarily disable the storefront for visitors.
                                </p>
                            </div>
                            <Switch 
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" /> Notifications
                        </CardTitle>
                        <CardDescription>
                            Control what alerts you receive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">New Order Alerts</Label>
                                <p className="text-sm text-gray-500">
                                    Receive notification when a customer places an order.
                                </p>
                            </div>
                            <Switch 
                                checked={settings.orderNotifications}
                                onCheckedChange={(checked) => handleChange("orderNotifications", checked)}
                            />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Alerts</Label>
                                <p className="text-sm text-gray-500">
                                    Receive daily digest emails.
                                </p>
                            </div>
                            <Switch 
                                checked={settings.emailAlerts}
                                onCheckedChange={(checked) => handleChange("emailAlerts", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Security
                        </CardTitle>
                        <CardDescription>
                            manage account security settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-500">
                                    Add an extra layer of security to your admin account.
                                </p>
                            </div>
                            <Switch 
                                checked={settings.twoFactorAuth}
                                onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SettingsPage;
