import React from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Users, Briefcase, CheckCircle2 } from 'lucide-react';

const account = {
  name: 'Geovance Field Collective',
  subscription: 'PRO',
  landRange: '10-50 hectares',
  seats: 8,
  planDescription: 'Best for midsize operations managing multiple fields with shared users.',
};

const members = [
  { name: 'Amina Ben', role: 'Owner', email: 'amina@geovance.com', status: 'Active' },
  { name: 'Omar Saadi', role: 'Agronomist', email: 'omar@geovance.com', status: 'Active' },
  { name: 'Nora Haddad', role: 'Operator', email: 'nora@geovance.com', status: 'Invited' },
  { name: 'Youssef Ali', role: 'Viewer', email: 'youssef@geovance.com', status: 'Active' },
];

const subscriptions = [
  { name: 'FELLAH', range: '5 - 10 hectares', description: 'Free plan for small landholders.', featured: false },
  { name: 'PRO', range: '10 - 50 hectares', description: 'Recommended for growing farms with shared field teams.', featured: true },
  { name: 'EMPIRE', range: '50+ hectares', description: 'Enterprise-grade plan for large estates and multi-account operations.', featured: false },
];

export default function Settings() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-semibold">Account settings</p>
          <h1 className="text-3xl font-bold text-slate-900">Account & subscription details</h1>
          <p className="text-slate-500 max-w-2xl">View your subscription type, account summary, and team member roles for shared access.</p>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-3xl bg-emerald-50 p-3 text-emerald-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Account</p>
                <h2 className="text-xl font-semibold text-slate-900">{account.name}</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Subscription</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{account.subscription}</p>
                <p className="text-sm text-slate-500 mt-2">{account.landRange}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Seats</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{account.seats}</p>
                <p className="text-sm text-slate-500 mt-2">Users connected to this account</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-100 p-5">
              <p className="text-sm text-slate-700">{account.planDescription}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Team roles</p>
                <h2 className="text-xl font-semibold text-slate-900">People connected to this account</h2>
              </div>
            </div>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.email} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{member.role}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-3xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Subscription tiers</p>
                <h3 className="text-lg font-semibold text-slate-900">Choose your plan</h3>
              </div>
            </div>
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.name} className={`rounded-3xl border p-5 ${subscription.featured ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{subscription.name}</p>
                      <p className="text-xs text-slate-500">{subscription.range}</p>
                    </div>
                    {subscription.featured ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{subscription.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Multi-user access</p>
                <h3 className="text-lg font-semibold text-slate-900">Shared accounts, different roles</h3>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-7">
              Many people can connect to the same account with different permissions. Assign roles like Owner, Agronomist, Operator, and Viewer to protect data and keep teams aligned.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
