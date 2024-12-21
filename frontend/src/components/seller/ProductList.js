import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import useAxios from "../../components/useAxios";
import Header from "../includes/Header";

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const axiosInstance = useAxios();

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/products/");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Product
  const handleEdit = async () => {
    setEditLoading(true);
  
    try {
      // Prepare FormData object
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("price", editProduct.price);
      formData.append("stock", editProduct.stock);
      formData.append("description", editProduct.description);
      formData.append("category", editProduct.category?.id || editProduct.category);
  
      // Append image only if it's a File object
      if (editProduct.image instanceof File) {
        formData.append("image", editProduct.image);
      }
  
      const response = await axiosInstance.put(
        `/api/v1/products/products/${editProduct.id}/edit/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Product updated:", response.data);
      setEditProduct(null); // Close dialog
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error);
    } finally {
      setEditLoading(false);
    }
  };
  

  // Handle Delete Product
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/api/v1/products/products/${deleteProductId}/delete/`);
      setDeleteProductId(null); // Close dialog
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error);
    } finally {
      setDeleteLoading(false);
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
    <>
      <Header />
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Your Products
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://127.0.0.1:8001${product.image}`}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                  <Typography  variant="body2" color="text.secondary">
                    Old Price: {product.old_price}
                  </Typography>
                  <Typography  variant="body2" color="text.secondary">
                    Description: {product.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => setDeleteProductId(product.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Edit Dialog */}
      {editProduct && (
        <Dialog open onClose={() => setEditProduct(null)}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Name"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Price"
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Stock"
              type="number"
              value={editProduct.stock}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProduct(null)} disabled={editLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              variant="contained"
              color="primary"
              disabled={editLoading}
            >
              {editLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteProductId && (
        <Dialog open onClose={() => setDeleteProductId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteProductId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default SellerProductList;
