import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import useAxios from "../../components/useAxios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Header from '../includes/Header';

// Register all necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, ArcElement, PointElement, Tooltip, Legend);

const SellerAnalytics = () => {
  const axiosInstance = useAxios();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/products/analytics/seller/');
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  // Chart Data for Revenue Over Time
  const revenueData = {
    labels: analytics.revenue_over_time.map((item) => item.day),
    datasets: [
      {
        label: 'Revenue',
        data: analytics.revenue_over_time.map((item) => item.daily_revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart Data for Order Status Breakdown
  const orderStatusData = {
    labels: analytics.order_status_breakdown.map((item) => item.status),
    datasets: [
      {
        data: analytics.order_status_breakdown.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Chart Data for Best-Selling Products
  const bestSellingData = {
    labels: analytics.best_selling_products.map((item) => item.product__name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: analytics.best_selling_products.map((item) => item.quantity_sold),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <Header />
    <Box padding={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Seller Analytics Dashboard
      </Typography>

      {/* Metrics Overview */}
      <Grid container spacing={3} marginBottom={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
              <Typography variant="h4">${analytics.total_revenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Orders
              </Typography>
              <Typography variant="h4">{analytics.total_orders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Customers
              </Typography>
              <Typography variant="h4">{analytics.customer_count}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Repeat Customer Rate
              </Typography>
              <Typography variant="h4">{analytics.repeat_customer_rate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              <Line data={revenueData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status Breakdown
              </Typography>
              <Pie data={orderStatusData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best-Selling Products
              </Typography>
              <Bar data={bestSellingData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default SellerAnalytics;
