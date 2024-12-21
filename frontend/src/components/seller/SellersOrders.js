import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import useAxios from "../../components/useAxios";
import Header from "../includes/Header";

function SellersOrders() {
  const axiosInstance = useAxios();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/orders/");
        setOrders(response.data.orders || []); // Adjust to your API response structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err.response || err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosInstance]);

  const renderOrderItems = (items, order) => {
    return items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.product_name}</TableCell>
        <TableCell>{order.user_name}</TableCell>
        <TableCell>{order.user_email || "N/A"}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>${item.price.toFixed(2)}</TableCell>
      </TableRow>
    ));
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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Orders for Your Products
        </Typography>
        {!orders.length ? (
          <Alert severity="info">No orders found for your products.</Alert>
        ) : (
          <Grid container spacing={4}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} key={order.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Order ID: {order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order Date: {new Date(order.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {order.status}
                    </Typography>

                    <Typography variant="h6" mt={2} gutterBottom>
                      Customer Details:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Name: {order.user_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {order.user_email || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {order.user_profile?.phone_number || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Address: {order.user_profile?.address || "N/A"}
                    </Typography>

                    <Typography variant="h6" mt={2} gutterBottom>
                      Ordered Items:
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {renderOrderItems(order.items, order)}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default SellersOrders;
