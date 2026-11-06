import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  Search,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  FileCheck2,
  Users,
  Building2,
  Layers,
  Sparkles,
  Zap,
  Trash2,
  Droplets,
  Construction,
  Lightbulb,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const categories = [
    {
      name: 'Roads & Pavements',
      icon: Construction,
      description: 'Potholes, broken footpaths, road cracks, collapsed dividers, and hazards.',
      badge: 'High Impact',
    },
    {
      name: 'Streetlights & Electrical',
      icon: Lightbulb,
      description: 'Flickering or unlit street lamps, exposed electrical wiring, and junction faults.',
      badge: 'Safety Critical',
    },
    {
      name: 'Waste & Sanitation',
      icon: Trash2,
      description: 'Overflowing public bins, illegal garbage dumping, and unsanitary conditions.',
      badge: 'Public Health',
    },
    {
      name: 'Water Supply & Drainage',
      icon: Droplets,
      description: 'Pipeline leaks, contaminated municipal water supply, and choked storm drains.',
      badge: 'Utility',
    },
    {
      name: 'Public Infrastructure',
      icon: Building2,
      description: 'Damaged park benches, broken playground equipment, and public restroom issues.',
      badge: 'Civic Asset',
    },
    {
      name: 'General Community Issues',
      icon: Layers,
      description: 'Encroachments, stray hazard concerns, fallen trees, and community maintenance.',
      badge: 'Municipal',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Spot & Document',
      description: 'Take a photo of the civic defect. Location coordinates are automatically or manually attached.',
      icon: Camera,
    },
    {
      number: '02',
      title: 'Instant Submission',
      description: 'Choose the appropriate category and submit. Receive an official unique Tracking ID (e.g., CC-2026-000001).',
      icon: FileCheck2,
    },
    {
      number: '03',
      title: 'Municipal Review & Triage',
      description: 'Official department engineers review the allegation, assign priority, and deploy ground workers.',
      icon: Building2,
    },
    {
      number: '04',
      title: 'Evidence-Backed Resolution',
      description: 'Never marked resolved without administrator verification and photographic after-repair evidence.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 bg-gradient-to-b from-white via-slate-50 to-brand-bg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-xs font-semibold text-brand-teal uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon PS-14 Innovation Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-tight">
                See a Problem? <br />
                <span className="text-brand-teal">Help Make Your Community Better.</span>
              </h1>

              <p className="text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Report local infrastructure issues, track their progress, and work together with local authorities to build cleaner, safer, and better-connected communities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link to="/citizen/submit">
                  <Button
                    size="lg"
                    variant="secondary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto shadow-md"
                  >
                    Report an Issue
                  </Button>
                </Link>
                <Link to="/track">
                  <Button
                    size="lg"
                    variant="outline"
                    leftIcon={<Search className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Track Complaint Status
                  </Button>
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-brand-navy">100%</div>
                  <div className="text-xs text-brand-muted">Audited Updates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-teal">&lt; 24h</div>
                  <div className="text-xs text-brand-muted">Initial Triage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-navy">4.8 / 5</div>
                  <div className="text-xs text-brand-muted">Citizen Rating</div>
                </div>
              </div>
            </div>

            {/* Right Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                {/* Header preview bar */}
                <div className="bg-brand-navy px-5 py-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-slate-300 font-mono ml-2">CivicConnect Live Issue</span>
                  </div>
                  <StatusBadge status="IN_PROGRESS" size="sm" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-semibold text-brand-teal">
                        #CC-2026-000412
                      </span>
                      <h3 className="font-bold text-base text-brand-navy mt-1">
                        Deep Pothole on Market Main Crossroad
                      </h3>
                    </div>
                    <PriorityBadge priority="HIGH" size="sm" />
                  </div>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    Vehicular traffic swerving to avoid hazard near pedestrian crossing. Road surfacing damaged post monsoon rains.
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span className="truncate">7th Main Rd, Indiranagar, Bengaluru, KA</span>
                  </div>

                  {/* Progress Timeline snippet */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-semibold text-brand-navy uppercase tracking-wider mb-2">
                      Official Lifecycle
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                      </span>
                      <span className="font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                      </span>
                      <span className="font-medium text-amber-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress
                      </span>
                      <span className="text-slate-400">Resolved</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link to="/track" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Inspect Real Tracking View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Clear, Transparent Process
          </div>
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">
            How CivicConnect Works
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            From the initial photo snapshot on your street to the final verifiable asphalt patch, every step is recorded on an immutable municipal ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group"
              >
                <div className="text-4xl font-black text-slate-100 group-hover:text-brand-teal/10 transition-colors absolute top-3 right-4 select-none">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">{step.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Comprehensive Municipal Coverage
          </div>
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">
            What Can You Report?
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            CivicConnect categorizes issues directly to the corresponding municipal departments for expedited resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-brand-teal transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center group-hover:bg-brand-teal transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-brand-navy mb-1.5">{cat.name}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link
                    to="/citizen/submit"
                    className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark flex items-center gap-1"
                  >
                    Report this issue <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accountability & Transparency Section (Mandatory PS-14 requirement) */}
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">
                Accountability Standards
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Designed for Integrity. Guaranteed by Policy.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Too many platforms allow reports to disappear into bureaucratic black holes. CivicConnect enforces strict platform rules rooted in civic trust:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">No Premature Resolution Claims</h4>
                    <p className="text-xs text-slate-400">
                      An issue cannot be marked "Resolved" without an administrative record, responsible officer identity, and optional photographic proof.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Allegations vs Verified Facts</h4>
                    <p className="text-xs text-slate-400">
                      New submissions are held in "Submitted" status until physically or administratively validated, preventing misinformation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Zero-Friction Privacy</h4>
                    <p className="text-xs text-slate-400">
                      Geographic coordinates are strictly optional. Precise residential addresses are sanitized to protect citizen privacy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-8 border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-teal" />
                Administrative Transparency Charter
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400">Duplicate Prevention</div>
                  <div className="text-lg font-bold text-brand-teal mt-1">Smart Engine</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Clusters reports within 200m to prevent duplicate work orders.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400">Audit Trail</div>
                  <div className="text-lg font-bold text-white mt-1">Immutable</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Every priority or status modification is cryptographically logged.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-brand-teal">Join your neighborhood network</div>
                  <div className="text-[11px] text-slate-300">Empower your ward with active civic participation.</div>
                </div>
                <Link to="/register">
                  <Button size="sm" variant="secondary">
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to report a community problem?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              It takes less than 60 seconds. Attach a photo, specify the issue, and track the municipality's progress in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/citizen/submit">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-brand-text bg-white">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
