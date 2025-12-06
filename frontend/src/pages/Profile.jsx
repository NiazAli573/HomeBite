import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="mb-4">
                <i className="bi bi-person-circle text-primary"></i> My Profile
              </h2>

              <div className="text-center mb-4">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image bg-light d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-circle display-1 text-muted"></i>
                  </div>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Username:</strong>
                  <p>{user.username}</p>
                </div>
                <div className="col-md-6">
                  <strong>Email:</strong>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>First Name:</strong>
                  <p>{user.first_name}</p>
                </div>
                <div className="col-md-6">
                  <strong>Last Name:</strong>
                  <p>{user.last_name}</p>
                </div>
              </div>

              <div className="mb-3">
                <strong>Phone Number:</strong>
                <p>{user.phone_number}</p>
              </div>

              <div className="mb-3">
                <strong>Account Type:</strong>
                <p>
                  <span className={`badge ${user.is_cook ? 'bg-primary' : 'bg-success'}`}>
                    {user.is_cook ? 'Cook' : 'Customer'}
                  </span>
                </p>
              </div>

              {user.is_cook && (
                <>
                  <hr />
                  <h5 className="mb-3">Kitchen Information</h5>
                  <div className="mb-3">
                    <strong>Kitchen Address:</strong>
                    <p>{user.kitchen_address}</p>
                  </div>
                  {user.bio && (
                    <div className="mb-3">
                      <strong>Bio:</strong>
                      <p>{user.bio}</p>
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Average Rating:</strong>
                    <p>
                      <span className="rating-stars">
                        {user.average_rating ? (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bi bi-star${
                                  i < Math.round(user.average_rating) ? '-fill' : ''
                                }`}
                              />
                            ))}
                            <span className="ms-2">
                              ({user.average_rating.toFixed(1)})
                            </span>
                          </>
                        ) : (
                          'No ratings yet'
                        )}
                      </span>
                    </p>
                  </div>
                </>
              )}

              <button className="btn btn-primary">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
