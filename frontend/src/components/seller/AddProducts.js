import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import useAxios from "../../components/useAxios";
import Header from "../includes/Header";

function AddProduct() {
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    quantity: "",
    stock: "",
    category: "",
    image: null,
    review: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setMessage("Unable to load categories");
        setMessageType("error");
      }
    };

    fetchCategories();
  }, [axiosInstance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axiosInstance.post("/api/v1/products/add_products/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Product added successfully!");
      setMessageType("success");
      setFormData({
        name: "",
        description: "",
        price: "",
        old_price: "",
        quantity: "",
        stock: "",
        category: "",
        image: null,
        review: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product. Please check your inputs.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <Box sx={{ maxWidth: "800px", margin: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {/* Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              {/* Price and Stock */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Old Price"
                  name="old_price"
                  type="number"
                  value={formData.old_price}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Quantity and Stock */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {/* Review */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Review"
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              {/* Image Upload */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Upload Product Image
                  <input
                    type="file"
                    hidden
                    name="image"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.image && (
                  <Typography variant="body2" mt={1}>
                    {formData.image.name}
                  </Typography>
                )}
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ textTransform: "none", height: "50px" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {message && (
            <Alert severity={messageType} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
    </>
  );
}

export default AddProduct;
