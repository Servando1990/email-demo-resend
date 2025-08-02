'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { INDUSTRIES, DEAL_STAGES, type Industry, type DealStage, type Deal } from '@/lib/types';

interface FormData {
  companyName: string;
  industry: Industry | '';
  stage: DealStage | '';
  description: string;
}

interface FormErrors {
  companyName?: string;
  industry?: string;
  stage?: string;
  description?: string;
}

export default function DealForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    stage: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.stage) {
      newErrors.stage = 'Please select a deal stage';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deal description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create the deal via API
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          industry: formData.industry,
          stage: formData.stage,
          description: formData.description.trim()
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create deal');
      }

      const newDeal = result.data;
      console.log('New deal created:', newDeal);

      // Trigger email automation campaign
      try {
        const campaignResponse = await fetch('/api/emails/campaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dealId: newDeal.id,
            type: 'deal_announcement'
          })
        });

        const campaignResult = await campaignResponse.json();
        
        if (campaignResult.success) {
          console.log('Email campaign sent:', campaignResult.data);
        } else {
          console.warn('Email campaign failed:', campaignResult.error);
        }
      } catch (campaignError) {
        console.warn('Failed to send email campaign:', campaignError);
        // Don't fail the entire operation if email fails
      }

      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        companyName: '',
        industry: '',
        stage: '',
        description: ''
      });
      setErrors({});

      // Auto-hide success message
      setTimeout(() => setSubmitStatus('idle'), 5000);

    } catch (error) {
      console.error('Error creating deal:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Add New Deal
          </h2>
          <p className="text-gray-600 mt-1">
            Create a new investment opportunity to automatically notify relevant investors
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-green-800">
              <div className="font-medium">Deal created successfully!</div>
              <div className="text-sm">Relevant investors have been automatically notified.</div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-red-800">
              <div className="font-medium">Error creating deal</div>
              <div className="text-sm">Please try again or contact support if the problem persists.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g. SolarTech Inc"
              disabled={isSubmitting}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select an industry</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>

          {/* Deal Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
              Deal Stage *
            </label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.stage ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select a stage</option>
              {DEAL_STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            {errors.stage && (
              <p className="mt-1 text-sm text-red-600">{errors.stage}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Deal Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Brief description of the investment opportunity, key value propositions, and what makes this deal attractive..."
              disabled={isSubmitting}
            />
            <div className="mt-1 flex justify-between">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Deal...
                </span>
              ) : (
                'Create Deal & Notify Investors'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Current Deals */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Deals</h3>
        <CurrentDeals />
      </div>
    </div>
  );
}

function CurrentDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        const result = await response.json();
        if (result.success) {
          setDeals(result.data);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="animate-spin h-6 w-6 mx-auto mb-2 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        <p>Loading deals...</p>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <PlusCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>No deals created yet. Add your first deal above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map(deal => (
        <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{deal.companyName}</h4>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {deal.industry}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {deal.stage}
                </span>
                <span>
                  Created {new Date(deal.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{deal.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}