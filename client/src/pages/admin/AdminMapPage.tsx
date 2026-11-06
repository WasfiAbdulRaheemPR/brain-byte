import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import { Complaint, Category } from '../../types';
import { MapPin, Filter, Layers, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Custom SVG Leaflet icon maker based on status
const createCustomIcon = (status: string) => {
  let color = '#3b82f6';
  if (status === 'UNDER_REVIEW') color = '#8b5cf6';
  if (status === 'IN_PROGRESS') color = '#f59e0b';
  if (status === 'RESOLVED') color = '#10b981';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

export const AdminMapPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch geocoded complaints
  const { data, isLoading } = useQuery<{ complaints: Complaint[] }>({
    queryKey: ['adminMapComplaints'],
    queryFn: async () => (await api.get('/admin/map')).data?.data,
  });

  const { data: catData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/complaints/categories')).data,
  });

  const complaints = data?.complaints || [];
  const categories = catData?.categories || [];

  const filtered = complaints.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (priorityFilter && c.priority !== priorityFilter) return false;
    if (categoryFilter && c.categoryId !== categoryFilter) return false;
    return true;
  });

  // Center on average coords or default to central Bangalore
  const defaultCenter: [number, number] =
    filtered.length > 0 && filtered[0].latitude && filtered[0].longitude
      ? [filtered[0].latitude, filtered[0].longitude]
      : [12.9716, 77.5946];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Interactive GIS Issue Map
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Spatial distribution of geocoded civic defects across municipal wards and zones.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Submitted
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Under Review
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-brand-navy font-semibold">
          <Filter className="w-4 h-4 text-brand-teal" /> Active Map Filters:
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal max-w-[150px] truncate"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500">
          Showing <strong>{filtered.length}</strong> geocoded issues
        </div>
      </div>

      {/* Map Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden h-[600px] relative">
        {isLoading ? (
          <LoadingSpinner label="Loading GIS map layers..." fullHeight />
        ) : (
          <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map((c) => {
              if (!c.latitude || !c.longitude) return null;
              return (
                <Marker
                  key={c.id}
                  position={[c.latitude, c.longitude]}
                  icon={createCustomIcon(c.status)}
                >
                  <Popup>
                    <div className="p-1 space-y-2 max-w-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-[10px] font-bold text-brand-teal">
                          {c.complaintNumber}
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>

                      <h4 className="font-bold text-xs text-brand-navy leading-snug">
                        {c.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {c.description}
                      </p>

                      {c.address && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <PriorityBadge priority={c.priority} size="sm" />
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="text-[11px] font-semibold text-brand-teal hover:underline flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
