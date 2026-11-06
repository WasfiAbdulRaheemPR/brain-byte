import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Civic<span className="text-brand-teal">Connect</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              CivicConnect is an open, accountable digital bridge connecting residents with local municipal authorities to report, track, and resolve community infrastructure failures.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-brand-teal">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping"></span>
              Hackathon Problem Statement: PS-14 Civic Innovation
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-brand-teal transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-brand-teal transition-colors">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-teal transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link to="/login?role=admin" className="hover:text-brand-teal transition-colors">
                  Administrative Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Transparency */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Integrity & Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Reports are treated as allegations until officially reviewed. Never claims resolution without recorded administrative proof.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-brand-teal" />
              <span>Location privacy protected by default</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved. Built for PS-14.
          </div>
          <div className="flex items-center gap-1">
            Built with transparency and public participation
          </div>
        </div>
      </div>
    </footer>
  );
};

