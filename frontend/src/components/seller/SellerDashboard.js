import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import useAxios from "../useAxios";

const SellerDashboard = () => {
  const axiosInstance = useAxios();
  const [analytics, setAnalytics] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch seller analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/analytics/seller/");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    // Fetch seller products data
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/");
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchAnalytics();
    fetchProducts();
  }, [axiosInstance]);

  const chartData = {
    labels: analytics.revenue_over_time?.map((item) => item.day) || [],
    datasets: [
      {
        label: "Revenue",
        data: analytics.revenue_over_time?.map((item) => item.daily_revenue) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box padding={4}>
      {/* Welcome Message */}
      <Typography variant="h4" gutterBottom>
        Welcome, Seller!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Manage your products, track orders, and view analytics.
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} marginBottom={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
              <Typography variant="h4">${analytics.total_revenue?.toFixed(2) || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Orders
              </Typography>
              <Typography variant="h4">{analytics.total_orders || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Products Listed
              </Typography>
              <Typography variant="h4">{products.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Chart */}
      <Box marginBottom={4}>
        <Typography variant="h6" gutterBottom>
          Revenue Over Time
        </Typography>
        <Bar data={chartData} />
      </Box>

      {/* Product Management Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Products
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
