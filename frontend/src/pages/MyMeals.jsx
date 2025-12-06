import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mealService } from '../services/mealService';

const MyMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyMeals();
  }, []);

  const fetchMyMeals = async () => {
    try {
      const data = await mealService.getMyMeals();
      setMeals(data);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load your meals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    try {
      await mealService.deleteMeal(id);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) {
      alert('Failed to delete meal');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="bi bi-hourglass-split" style={{ fontSize: '3rem', color: '#FF6B35', animation: 'spin 2s linear infinite' }}></i>
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading your meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '2rem 0 3rem 0'
    }}>
      <div className="container-lg">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#212529',
            margin: 0
          }}>
            <i className="bi bi-egg-fried me-2" style={{ color: '#FF6B35' }}></i>
            My Meals
          </h1>
          <Link to="/meals/create" style={{
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            color: 'white',
            padding: '0.875rem 1.75rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
          }}>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Meal
          </Link>
        </div>

        {error && (
          <div style={{
            background: '#FFE5E5',
            border: '2px solid #FF6B35',
            color: '#B30000',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {meals.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#BDBDBD', display: 'block', marginBottom: '1rem' }}></i>
            <p style={{ color: '#757575', fontSize: '1.1rem', fontWeight: '300', marginBottom: '1.5rem' }}>You haven't created any meals yet.</p>
            <Link to="/meals/create" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              color: 'white',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
            }}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Your First Meal
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {meals.map((meal) => (
              <div key={meal.id} style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}>
                {/* Meal Image */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '180px', background: '#F8F9FA' }}>
                  {meal.photo ? (
                    <img
                      src={meal.photo}
                      alt={meal.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-image" style={{ fontSize: '2.5rem', color: '#BDBDBD' }}></i>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '0.5rem'
                  }}>
                    {meal.name}
                  </h5>
                  <p style={{
                    color: '#757575',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    flex: 1
                  }}>
                    {meal.description?.substring(0, 80)}
                    {meal.description?.length > 80 ? '...' : ''}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #E0E0E0'
                  }}>
                    <div>
                      <p style={{
                        background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        margin: 0
                      }}>
                        Rs. {meal.price}
                      </p>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#BDBDBD' }}>
                      <div><i className="bi bi-clock me-1"></i>{meal.ready_time}</div>
                      <div><i className="bi bi-basket me-1"></i>{meal.quantity_available} servings</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem'
                  }}>
                    <Link
                      to={`/meals/edit/${meal.id}`}
                      style={{
                        background: 'white',
                        color: '#FF6B35',
                        border: '2px solid #FF6B35',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      style={{
                        background: 'white',
                        color: '#DC3545',
                        border: '2px solid #DC3545',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(220,53,69,0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMeals;
