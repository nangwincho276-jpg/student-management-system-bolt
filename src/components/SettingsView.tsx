import { useState } from 'react';
import { Bell, Globe, Moon, Palette, RotateCcw, Save, User } from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-blue-600' : 'bg-slate-200'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-5' : 'left-0.5'}`}
      />
    </button>
  );
}

export default function SettingsView({ onResetData }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your preferences and account.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Profile</h3>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Admin Name</label>
              <input
                defaultValue="Admin User"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Email</label>
              <input
                defaultValue="admin@university.edu"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Role</label>
              <input
                disabled
                value="Administrator"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Palette className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Preferences</h3>
          </div>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Push Notifications</p>
                  <p className="text-xs text-slate-400">Get alerts about new students.</p>
                </div>
              </div>
              <Toggle on={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Weekly Email Digest</p>
                  <p className="text-xs text-slate-400">Summary of activity every Monday.</p>
                </div>
              </div>
              <Toggle on={emailDigest} onChange={setEmailDigest} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Dark Mode</p>
                  <p className="text-xs text-slate-400">Switch to a darker theme.</p>
                </div>
              </div>
              <Toggle on={darkMode} onChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Language</p>
                  <p className="text-xs text-slate-400">Interface language.</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save + danger zone */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
          {saved && (
            <span className="ml-3 text-sm font-medium text-emerald-600">Saved successfully!</span>
          )}
        </div>
        <div className="border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-500">Danger Zone</p>
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
