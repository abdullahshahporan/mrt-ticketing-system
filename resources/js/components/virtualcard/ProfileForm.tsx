import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  name: string;
  email: string;
  contactNo: string;
  nidNo: string;
  dateOfBirth: string;
}

interface FormErrors {
  name?: string;
  contactNo?: string;
  nidNo?: string;
  dateOfBirth?: string;
}

interface ProfileFormProps {
  userEmail: string;
  onProfileComplete?: (data: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userEmail, onProfileComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: userEmail,
    contactNo: '',
    nidNo: '',
    dateOfBirth: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Contact number validation (Bangladesh format)
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Enter a valid 11-digit Bangladesh mobile number (e.g., 01712345678)';
    }

    // NID validation (10 or 13 or 17 digits)
    if (!formData.nidNo.trim()) {
      newErrors.nidNo = 'NID number is required';
    } else if (!/^(\d{10}|\d{13}|\d{17})$/.test(formData.nidNo)) {
      newErrors.nidNo = 'Enter a valid NID number (10, 13, or 17 digits)';
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (age < 13 || (age === 13 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Submit to Laravel controller
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - profile completed
        console.log('Profile completed:', result.data);
        
        // Call callback if provided
        if (onProfileComplete) {
          onProfileComplete(result.data);
        }
        
        alert(result.message || 'Profile completed successfully! 🎉');
        
        // Redirect to payment if specified in response
        if (result.redirect) {
          navigate(result.redirect);
        }
        
      } else {
        // Handle validation errors from backend
        if (result.errors) {
          // Laravel returns errors as arrays, so we need to process them
          const processedErrors: FormErrors = {};
          Object.keys(result.errors).forEach(key => {
            const errorMessages = result.errors[key];
            processedErrors[key as keyof FormErrors] = Array.isArray(errorMessages) 
              ? errorMessages[0] 
              : errorMessages;
          });
          setErrors(processedErrors);
        } else {
          alert(result.message || 'Failed to complete profile. Please try again.');
        }
      }
      
    } catch (error) {
      console.error('Error completing profile:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Account Status */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-red-800 font-semibold">Account Inactive</p>
            <p className="text-sm text-red-700">To apply for Virtual MRT Card Fill Up the form</p>
          </div>
        </div>
      </div>

      {/* Complete Profile Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
        <p className="text-gray-600 text-sm">Please provide the following information to activate your Virtual MRT Card</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.name 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
        </div>

        {/* Contact Number Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleInputChange}
            placeholder="01712345678"
            maxLength={11}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.contactNo 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
            }`}
          />
          {errors.contactNo && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.contactNo}
            </p>
          )}
        </div>

        {/* NID Number Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            NID Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nidNo"
            value={formData.nidNo}
            onChange={handleInputChange}
            placeholder="Enter your NID number (10, 13, or 17 digits)"
            maxLength={17}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.nidNo 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
            }`}
          />
          {errors.nidNo && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.nidNo}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.dateOfBirth 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Required Fields Note */}
        <p className="text-xs text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      </form>
    </div>
  );
};

export default ProfileForm;