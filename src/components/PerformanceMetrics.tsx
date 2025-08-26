import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { performanceMonitor } from '../utils/performance';

interface PerformanceMetricsProps {
  visible?: boolean;
}

export function PerformanceMetrics({ visible = false }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = React.useState<any[]>([]);
  const [isVisible, setIsVisible] = React.useState(visible);

  const updateMetrics = () => {
    setMetrics(performanceMonitor.getMetrics());
  };

  const clearMetrics = () => {
    performanceMonitor.clearMetrics();
    setMetrics([]);
  };

  const logMetrics = () => {
    performanceMonitor.logMetrics();
  };

  React.useEffect(() => {
    if (isVisible) {
      updateMetrics();
      const interval = setInterval(updateMetrics, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        variant="outlined"
        size="small"
        onClick={() => setIsVisible(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        Show Performance
      </Button>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 300,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 1000,
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Performance Metrics</Typography>
        <Button size="small" onClick={() => setIsVisible(false)}>
          Hide
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button size="small" onClick={updateMetrics} sx={{ mr: 1 }}>
          Refresh
        </Button>
        <Button size="small" onClick={clearMetrics} sx={{ mr: 1 }}>
          Clear
        </Button>
        <Button size="small" onClick={logMetrics}>
          Log
        </Button>
      </Box>

      {metrics.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No metrics available
        </Typography>
      ) : (
        <Box>
          {metrics.map((metric) => (
            <Box key={metric.componentName} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {metric.componentName}
              </Typography>
              <Typography variant="body2">
                Renders: {metric.renderCount}
              </Typography>
              <Typography variant="body2">
                Last: {metric.lastRenderTime.toFixed(2)}ms
              </Typography>
              <Typography variant="body2">
                Avg: {metric.averageRenderTime.toFixed(2)}ms
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
