import { Settings as SettingsIcon, Database, Server, RefreshCw, Bell, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure the AI Risk Intelligence Platform</p>
      </div>

      {/* API Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">API Configuration</h3>
            <p className="text-sm text-muted-foreground">Backend server connection settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              defaultValue="http://localhost:8000"
              className="font-mono"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Connection Status</p>
              <p className="text-sm text-muted-foreground">Backend server connectivity</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-success">Connected</span>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Test Connection
          </Button>
        </div>
      </Card>

      {/* Auto-Refresh */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Data Refresh</h3>
            <p className="text-sm text-muted-foreground">Configure automatic data updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Auto-Refresh Dashboard</p>
              <p className="text-sm text-muted-foreground">Refresh data every 30 seconds</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Real-time Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts for critical risks</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Alert preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Critical Risk Alerts</p>
              <p className="text-sm text-muted-foreground">Notify on severity 5 risks</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Job Failure Alerts</p>
              <p className="text-sm text-muted-foreground">Notify on crawler errors</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Daily Digest</p>
              <p className="text-sm text-muted-foreground">Summary of daily activity</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">About</h3>
            <p className="text-sm text-muted-foreground">System information</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono text-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Environment</span>
            <span className="font-mono text-foreground">Development</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Backend</span>
            <span className="font-mono text-foreground">FastAPI v0.100+</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
