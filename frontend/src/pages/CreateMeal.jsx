import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../services/mealService';

const CreateMeal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: 1,
    ready_time: '',
    dine_with_us_available: false,
    dine_price: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = { ...formData };
      if (photo) {
        data.photo = photo;
      }
      
      const result = await mealService.createMeal(data);
      console.log('✅ Meal created successfully:', result);
      
      // Show success message
      alert('Meal created successfully! Redirecting to My Meals...');
      
      // Navigate to My Meals page
      navigate('/meals/my-meals', { replace: true });
    } catch (err) {
      console.error('❌ Error creating meal:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message ||
                          (err.response?.data && typeof err.response.data === 'object' 
                            ? Object.values(err.response.data).flat().join(', ')
                            : '') ||
                          err.message ||
                          'Failed to create meal. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '2rem 0 3rem 0'
    }}>
      <div className="container-lg">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem 2.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#212529',
                marginBottom: '0.5rem'
              }}>
                <i className="bi bi-plus-circle me-2" style={{ color: '#FF6B35' }}></i>
                Create New Meal
              </h2>
              <p style={{ color: '#BDBDBD', marginBottom: '1.5rem' }}>Add a delicious meal to your menu</p>

              {error && (
                <div style={{
                  background: '#FFE5E5',
                  border: '2px solid #FF6B35',
                  color: '#B30000',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Meal Name */}
                <div>
                  <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Meal Name <span style={{ color: '#FF6B35' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Chicken Biryani"
                    style={{
                      width: '100%',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E0E0E0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your meal, ingredients, taste, etc."
                    style={{
                      width: '100%',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E0E0E0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Price & Quantity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                      Price (Rs) <span style={{ color: '#FF6B35' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 250"
                      style={{
                        width: '100%',
                        border: '2px solid #E0E0E0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FF6B35';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E0E0E0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                      Quantity Available <span style={{ color: '#FF6B35' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="quantity_available"
                      value={formData.quantity_available}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        border: '2px solid #E0E0E0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FF6B35';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E0E0E0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Ready Time */}
                <div>
                  <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Ready Time <span style={{ color: '#FF6B35' }}>*</span>
                  </label>
                  <input
                    type="time"
                    name="ready_time"
                    value={formData.ready_time}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E0E0E0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <small style={{ color: '#BDBDBD', marginTop: '0.5rem', display: 'block' }}>
                    When will this meal be ready for pickup/delivery?
                  </small>
                </div>

                {/* Dine-With-Us Feature */}
                <div style={{
                  background: 'rgba(255,107,53,0.05)',
                  border: '2px solid rgba(255,107,53,0.2)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: 0 }}>
                    <input
                      type="checkbox"
                      name="dine_with_us_available"
                      checked={formData.dine_with_us_available}
                      onChange={(e) => setFormData({ ...formData, dine_with_us_available: e.target.checked })}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '700', color: '#212529' }}>Allow Dine-In</span>
                  </label>
                  <p style={{ color: '#757575', fontSize: '0.9rem', margin: '0.5rem 0 0 2rem' }}>
                    Let customers dine at your place
                  </p>

                  {formData.dine_with_us_available && (
                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                        Dine-In Price (Rs) <span style={{ color: '#FF6B35' }}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="dine_price"
                        value={formData.dine_price}
                        onChange={handleChange}
                        required={formData.dine_with_us_available}
                        placeholder="Price for dine-in (can be different from takeaway)"
                        style={{
                          width: '100%',
                          border: '2px solid #E0E0E0',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#FF6B35';
                          e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E0E0E0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Meal Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{
                      width: '100%',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  />
                  {photoPreview && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{
                          maxHeight: '200px',
                          borderRadius: '0.75rem'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      fontSize: '1.05rem'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2" style={{ animation: 'spin 2s linear infinite' }}></i>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Meal
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/meals/my-meals')}
                    style={{
                      background: 'white',
                      color: '#FF6B35',
                      border: '2px solid #FF6B35',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '1.05rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMeal;
