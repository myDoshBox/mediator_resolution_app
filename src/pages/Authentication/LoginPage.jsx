import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slice/AuthSlice/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email if "remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const action = await dispatch(
      loginUser({ mediator_email: email, password }),
    );

    if (loginUser.fulfilled.match(action)) {
      toast.success("Login successful");

      // Save email if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } else if (loginUser.rejected.match(action)) {
      toast.error(action.payload || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left */}
        <div
          className="col-md-6 d-flex align-items-center justify-content-center text-white"
          style={{ backgroundColor: "hsl(152, 70%, 31%)" }}
        >
          <div className="text-center px-4">
            <h1 className="mb-3">Welcome to DoshBox</h1>
            <p className="lead">
              Your trusted platform for seamless dispute resolution.
            </p>
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
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group mb-2">
              <label>Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={togglePasswordVisibility}
                  style={{
                    textDecoration: "none",
                    color: "#6c757d",
                    padding: "0 12px",
                    zIndex: 10,
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-decoration-none"
                style={{ color: "hsl(152, 70%, 31%)", fontSize: "0.9rem" }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{
                backgroundColor: "hsl(152, 70%, 31%)",
                borderColor: "hsl(152, 70%, 31%)",
                color: "white",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-3">
              <p className="text-muted">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-decoration-none"
                  style={{ color: "hsl(152, 70%, 31%)" }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
