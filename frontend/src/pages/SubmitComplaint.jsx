import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import EnhancedLoading from '../components/EnhancedLoading';
import EnhancedNotification from '../components/EnhancedNotification';
import axios from 'axios';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    titleBangla: '',
    description: '',
    descriptionBangla: '',
    language: 'English',
    location: '',
    area: '',
    category: '',
    subCategory: '',
    priority: 'Medium',
    tags: ''
  });

  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = {
    'Natural Disasters': ['Flood', 'Earthquake', 'Landslide', 'Drought', 'Storm', 'Wildfire'],
    'Local Issues': ['Road', 'Water', 'Electricity', 'Sanitation', 'Education', 'Healthcare', 'Environment'],
    'Accidents': ['Traffic Accident', 'Building Collapse', 'Gas Leak', 'Fire Incident', 'Medical Emergency'],
    'Other': ['General']
  };

  const areas = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
    'Dhaka North', 'Dhaka South', 'Narayanganj', 'Gazipur', 'Tangail', 'Narsingdi'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Title and description' },
    { number: 2, title: 'Location & Category', description: 'Where and what type' },
    { number: 3, title: 'Photos & Priority', description: 'Visual evidence and urgency' },
    { number: 4, title: 'Review & Submit', description: 'Final review and submission' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed', 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return false;
      }
      return true;
    });

    if (photos.length + validFiles.length > 5) {
      showToast('Maximum 5 photos allowed', 'error');
      return;
    }

    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.area) {
      newErrors.area = 'Area is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 2:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.area) newErrors.area = 'Area is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      case 3:
        // Photos are optional, priority has default value
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      photos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });

      const response = await axios.post('/api/complaints', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        showToast('Complaint submitted successfully!', 'success');
        setTimeout(() => {
          navigate('/complaints');
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting complaint';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input-field ${errors.title ? 'input-error' : ''}`}
                placeholder="Brief description of the issue"
              />
              {errors.title && <div className="form-error">⚠️ {errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Title (বাংলা)</label>
              <input
                type="text"
                name="titleBangla"
                value={formData.titleBangla}
                onChange={handleInputChange}
                className="input-field"
                placeholder="সমস্যার সংক্ষিপ্ত বিবরণ"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`input-field ${errors.description ? 'input-error' : ''}`}
                placeholder="Detailed description of the issue, including any relevant details..."
              />
              {errors.description && <div className="form-error">⚠️ {errors.description}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Description (বাংলা)</label>
              <textarea
                name="descriptionBangla"
                value={formData.descriptionBangla}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                placeholder="সমস্যার বিস্তারিত বিবরণ, প্রাসঙ্গিক বিবরণ সহ..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="English">English</option>
                <option value="Bangla">বাংলা</option>
                <option value="Both">Both / উভয়</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`input-field ${errors.location ? 'input-error' : ''}`}
                placeholder="Specific location (street, landmark, etc.)"
              />
              {errors.location && <div className="form-error">⚠️ {errors.location}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Area <span className="text-red-500">*</span>
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className={`input-field ${errors.area ? 'input-error' : ''}`}
              >
                <option value="">Select an area</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              {errors.area && <div className="form-error">⚠️ {errors.area}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`input-field ${errors.category ? 'input-error' : ''}`}
              >
                <option value="">Select a category</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="form-error">⚠️ {errors.category}</div>}
            </div>

            {formData.category && categories[formData.category] && (
              <div className="form-group">
                <label className="form-label">Sub Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select a sub category</option>
                  {categories[formData.category].map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Separate tags with commas (e.g., urgent, infrastructure, safety)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="form-group">
              <label className="form-label">Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-violet-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary w-full"
                >
                  📷 Upload Photos (Max 5)
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB per photo
                </p>
              </div>

              {photos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Photos:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorities.map(priority => (
                  <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-full p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      formData.priority === priority
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-gray-200 hover:border-violet-300'
                    }`}>
                      {priority}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Complaint</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{formData.category} {formData.subCategory && `• ${formData.subCategory}`}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{formData.location}, {formData.area}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <p className="text-gray-900">{formData.priority}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{formData.description}</p>
                </div>

                {photos.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Photos</label>
                    <p className="text-gray-900">{photos.length} photo(s) selected</p>
                  </div>
                )}
              </div>
            </div>

            {isSubmitting && (
              <div className="card p-6 text-center">
                <EnhancedLoading 
                  type="ring" 
                  size="large" 
                  text="Submitting your complaint..." 
                  className="mx-auto mb-4"
                />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold gradient-text mb-4">Submit a Complaint</h1>
          <p className="text-xl text-gray-600">Help improve your community by reporting issues</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'border-violet-500 bg-violet-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-violet-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-violet-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center animate-fade-in-up">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">Our team is here to support you with the complaint submission process</p>
            <button
              onClick={() => navigate('/contact')}
              className="btn-secondary"
            >
              📞 Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
