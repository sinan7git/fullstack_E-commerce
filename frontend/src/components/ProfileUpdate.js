import React, { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress, Typography, Alert } from "@mui/material";
import useAxios from "../components/useAxios";

function ProfileUpdate() {
  const axiosInstance = useAxios();
  const [profile, setProfile] = useState({
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/update/profile/");
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err.response || err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axiosInstance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axiosInstance.put("/api/v1/products/update/profile/", profile);
      setProfile(response.data);
      setSuccess(true);
      setError(""); 
    } catch (err) {
      console.error("Error updating profile:", err.response || err);
      setError("Failed to update profile.");
      setSuccess(false);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={3} textAlign="center">
        Update Profile
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone_number"
          value={profile.phone_number || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Street Address"
          name="street_address"
          value={profile.street_address || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="City"
          name="city"
          value={profile.city || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="State"
          name="state"
          value={profile.state || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Postal Code"
          name="postal_code"
          value={profile.postal_code || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Country"
          name="country"
          value={profile.country || ""}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={updating}
        >
          {updating ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
        </Button>
      </form>
    </Box>
  );
}

export default ProfileUpdate;
