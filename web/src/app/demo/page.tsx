"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, LogOut, CheckCircle } from "lucide-react";

export default function AuthDemoPage() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication System Demo
          </h1>
          <p className="text-gray-600">
            Testing ChatFly's authentication and route protection
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge 
                  variant={isAuthenticated ? "default" : "destructive"}
                  className={isAuthenticated ? "bg-green-600" : ""}
                >
                  {isAuthenticated ? (
                    <><CheckCircle className="w-4 h-4 mr-1" /> Authenticated</>
                  ) : (
                    "Not Authenticated"
                  )}
                </Badge>
              </div>
              
              {isAuthenticated && user && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-mono text-sm">{user.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email:
                    </span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  
                  {user.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Name:
                      </span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ User Authentication (Login/Signup)</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Route Protection (Middleware)</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Auto-redirect after login</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Dashboard Layout Protection</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Logout Functionality</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Session Persistence</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Try these actions to test the authentication system:
              </p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('/auth/login', '_blank')}
                >
                  🔐 Open Login Page (New Tab)
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('/auth/signup', '_blank')}
                >
                  📝 Open Signup Page (New Tab)
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/chat'}
                >
                  💬 Go to Chat (Protected)
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/profile'}
                >
                  👤 Go to Profile (Protected)
                </Button>
              </div>
              
              {isAuthenticated && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This is a demo page showing the authentication system implementation.
            <br />
            In production, remove this page and use the actual dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
