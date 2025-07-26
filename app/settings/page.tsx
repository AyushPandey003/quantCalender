import { SettingsView } from "@/features/settings/components/settings-view"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <SettingsView />
      </div>
    </ProtectedRoute>
  )
}
