import React from "react";
import { Bell, Shield, Download, Smartphone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const DashboardSettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-zamzam-text-dark">Settings</h2>
        <p className="text-zamzam-text-muted">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-zamzam-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-zamzam-text-muted">
                Receive order updates and promotions via email
              </p>
            </div>
            <input
              type="checkbox"
              id="email-notifications"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-zamzam-text-muted">
                Get order status updates via text message
              </p>
            </div>
            <input
              type="checkbox"
              id="sms-notifications"
              className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-zamzam-text-muted">
                Receive notifications in your browser
              </p>
            </div>
            <input
              type="checkbox"
              id="push-notifications"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-zamzam-primary" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-zamzam-text-muted" />
              <div>
                <p className="font-medium text-zamzam-text-dark">
                  Email Preferences
                </p>
                <p className="text-sm text-zamzam-text-muted">
                  Manage your communication preferences
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-zamzam-text-muted" />
              <div>
                <p className="font-medium text-zamzam-text-dark">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-zamzam-text-muted">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-zamzam-text-muted" />
              <div>
                <p className="font-medium text-zamzam-text-dark">
                  Connected Devices
                </p>
                <p className="text-sm text-zamzam-text-muted">
                  Manage devices that can access your account
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Download className="w-5 h-5 text-zamzam-primary" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zamzam-surface rounded-lg">
            <div>
              <p className="font-medium text-zamzam-text-dark">
                Export Account Data
              </p>
              <p className="text-sm text-zamzam-text-muted">
                Download a copy of your account information and data
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettingsPage;
