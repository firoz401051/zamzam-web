"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { User, Mail, Phone, Calendar, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DashboardProfilePage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: user?.primaryPhoneNumber?.phoneNumber || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save to Clerk or your backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original user data
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: user?.primaryPhoneNumber?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-zamzam-text-dark">
            Profile
          </h2>
          <p className="text-zamzam-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zamzam-text-dark">
              Profile
            </h2>
            <p className="text-zamzam-text-muted">
              Manage your personal information
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zamzam-primary-light rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-zamzam-primary" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-zamzam-surface rounded-lg">
                  <User className="w-4 h-4 text-zamzam-text-muted" />
                  <span className="text-zamzam-text-dark">
                    {profileData.firstName || "Not set"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-zamzam-surface rounded-lg">
                  <User className="w-4 h-4 text-zamzam-text-muted" />
                  <span className="text-zamzam-text-dark">
                    {profileData.lastName || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-zamzam-text-muted" />
              <span className="text-zamzam-text-dark">
                {profileData.email}
              </span>
              <span className="text-xs text-zamzam-text-muted ml-auto">
                Managed by your account provider
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-zamzam-surface rounded-lg">
                <Phone className="w-4 h-4 text-zamzam-text-muted" />
                <span className="text-zamzam-text-dark">
                  {profileData.phone || "Not set"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zamzam-text-muted" />
              <div>
                <p className="font-medium text-zamzam-text-dark">
                  Member Since
                </p>
                <p className="text-sm text-zamzam-text-muted">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-zamzam-text-muted" />
              <div>
                <p className="font-medium text-zamzam-text-dark">
                  Account ID
                </p>
                <p className="text-sm text-zamzam-text-muted font-mono">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfilePage;
