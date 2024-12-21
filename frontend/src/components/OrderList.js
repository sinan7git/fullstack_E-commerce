import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import useAxios from './useAxios'; // Custom Axios hook
import Header from "./includes/Header";

const MyOrders = () => {
  const axiosInstance = useAxios(); // Use your custom Axios instance
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/products/my-orders/');
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to load orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosInstance]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
    <Header />
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Alert severity="info">No orders found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Typography variant="body1">Date: {new Date(order.created_at).toLocaleDateString()}</Typography>
                  <Typography variant="body1">Status: {order.status}</Typography>
                  <Typography variant="body1">Total: ${order.total_price.toFixed(2)}</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Items:
                  </Typography>
                  {order.items.map((item, index) => (
                    <Typography key={index} variant="body2">
                      - {item.product_name} x {item.quantity} (${item.price.toFixed(2)})
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
    </>
  );
};

export default MyOrders;
