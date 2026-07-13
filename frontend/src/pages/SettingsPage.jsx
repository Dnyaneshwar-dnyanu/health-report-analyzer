import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiShield, FiSave } from 'react-icons/fi';
import { Section } from '../components/common/Section/Section';
import { Card } from '../components/common/Card/Card';
import { Button } from '../components/common/Button/Button';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'security', label: 'Security', icon: FiShield },
];

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Section className="py-4 md:py-8 w-full max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-[var(--color-muted)]">
          Manage your account preferences and security.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-left",
                  isActive 
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                    : "text-[var(--color-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-card)]"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Card className="p-6 md:p-8">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-[var(--color-border)]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">First Name</label>
                      <input type="text" defaultValue="John" className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">Email Address</label>
                      <input type="email" defaultValue="john.doe@example.com" className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button icon={FiSave}>Save Changes</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                <p className="text-[var(--color-muted)]">Configure how you receive updates about your reports.</p>
                {/* Mock toggles would go here */}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                <p className="text-[var(--color-muted)]">Update your password and manage 2FA.</p>
                {/* Mock security form would go here */}
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
};
