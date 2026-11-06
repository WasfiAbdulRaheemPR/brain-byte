import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { Category, Priority } from '../../types';
import {
  FilePlus2,
  Camera,
  MapPin,
  Sparkles,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [address, setAddress] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  // AI Assistance state
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedCategory?: string;
    suggestedPriority?: Priority;
    reasoning?: string;
  } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  const { data: catData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/complaints/categories');
      return res.data;
    },
  });

  const categories = catData?.categories || [];

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 5) {
      setError('You can upload a maximum of 5 photographs.');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Browser Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        if (!address) {
          setAddress('GPS Captured: Near Current Location');
        }
      },
      (err) => {
        setError(`Unable to retrieve location: ${err.message}`);
      }
    );
  };

  // AI Auto-Categorize & Priority Assistant
  const handleAIAssist = async () => {
    if (!title.trim() && !description.trim()) {
      setError('Please provide at least a title or description for AI analysis.');
      return;
    }

    setIsAILoading(true);
    setError(null);

    try {
      const [catRes, prioRes] = await Promise.all([
        api.post('/ai/categorize', { title, description }),
        api.post('/ai/recommend-priority', { title, description }),
      ]);

      const catName = catRes.data?.data?.suggestedCategory;
      const matchedCat = categories.find((c) =>
        c.name.toLowerCase().includes(catName?.toLowerCase() || '')
      );

      if (matchedCat && !categoryId) {
        setCategoryId(matchedCat.id);
      }

      setAiSuggestion({
        suggestedCategory: catName,
        suggestedPriority: prioRes.data?.data?.suggestedPriority,
        reasoning: catRes.data?.data?.reasoning,
      });
    } catch (err) {
      console.warn('AI assist unavailable:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select an issue category.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (address) formData.append('address', address);

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const createdComplaint = data.data?.complaint;
      if (createdComplaint?.id) {
        navigate(`/citizen/complaints/${createdComplaint.id}`);
      } else {
        navigate('/citizen/complaints');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-2">
          <FilePlus2 className="w-3.5 h-3.5" />
          Community Issue Reporting
        </div>
        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">
          Report a Community Problem
        </h1>
        <p className="text-sm text-brand-muted mt-1 leading-relaxed">
          Provide accurate details and photographs. Your complaint will be cataloged under an immutable tracking ID for municipal engineering review.
        </p>
      </div>

      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Issue Overview */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">1. Issue Details</h2>
              <p className="text-xs text-brand-muted">Explain what requires municipal remediation</p>
            </div>
            <button
              type="button"
              onClick={handleAIAssist}
              disabled={isAILoading}
              className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark bg-brand-teal/10 hover:bg-brand-teal/20 px-3 py-1.5 rounded-lg border border-brand-teal/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAILoading ? 'Analyzing...' : 'AI Category Assist'}
            </button>
          </div>

          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-brand-teal/10 border border-brand-teal/30 text-xs text-brand-navy space-y-1">
              <div className="font-bold flex items-center gap-1 text-brand-teal">
                <Sparkles className="w-3.5 h-3.5" /> AI Suggestion (Advisory Only)
              </div>
              <p>{aiSuggestion.reasoning}</p>
              <div className="text-[11px] text-slate-500 pt-1">
                Suggested Category: <strong>{aiSuggestion.suggestedCategory}</strong> • Recommended Priority:{' '}
                <strong>{aiSuggestion.suggestedPriority}</strong>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous deep pothole near residential crossroad"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text bg-white"
            >
              <option value="">-- Select Municipal Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the defect, visible dimensions, hazards, and approximately how long the issue has persisted..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
            />
          </div>
        </div>

        {/* Section 2: Photographic Evidence */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-brand-navy">2. Photographic Evidence</h2>
            <p className="text-xs text-brand-muted">Upload up to 5 clear photos of the issue (Max 5MB each)</p>
          </div>

          <div>
            <label className="border-2 border-dashed border-slate-300 hover:border-brand-teal rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
              <Camera className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-brand-navy">Click to browse or take photos</span>
              <span className="text-xs text-brand-muted mt-1">JPEG, PNG, WebP accepted</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Previews */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {filePreviews.map((preview, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Optional Location */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">3. Location Details (Optional)</h2>
              <p className="text-xs text-brand-muted">Sharing location helps municipal dispatch locate the site quickly</p>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-xs font-semibold text-brand-navy hover:text-brand-teal bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-brand-teal" />
              Use Current GPS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 12.9716"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 77.5946"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
              Street / Landmark / Ward Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Opposite Metro Pillar 142, 100ft Road, Indiranagar"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
            />
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-teal flex-shrink-0" />
            <span>
              Privacy Guarantee: Coordinates are solely used for field crew dispatch. Exact home addresses are never published publicly.
            </span>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/citizen/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto shadow-md"
          >
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  );
};
