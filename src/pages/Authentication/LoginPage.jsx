import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Redux/Slice/AuthSlice/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const action = await dispatch(loginUser({ mediator_email: email, password }));

    if (loginUser.fulfilled.match(action)) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else if (loginUser.rejected.match(action)) {
      toast.error(action.payload || 'Login failed');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left */}
        <div className="col-md-6 d-flex align-items-center justify-content-center text-white" style={{ backgroundColor: 'hsl(152, 70%, 31%)' }}>
          <div className="text-center px-4">
            <h1 className="mb-3">Welcome to DoshBox</h1>
            <p className="lead">Your trusted platform for seamless dispute resolution.</p>
          </div>
        </div>

        {/* Right */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form className="w-75" onSubmit={handleLogin}>
            <h2 className="mb-4">Login</h2>

            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
