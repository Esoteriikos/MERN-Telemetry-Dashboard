import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001/api'

const useMetricData = () => {
  const [metrics, setMetrics] = useState({
    cpu: null,
    memory: null,
    disk: null,
    network: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('Fetching metrics from:', API_BASE_URL)
      setLoading(true)
      setError(null)

      const [cpuResponse, memoryResponse, diskResponse, networkResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/cpu`),
        axios.get(`${API_BASE_URL}/memory`),
        axios.get(`${API_BASE_URL}/disk`),
        axios.get(`${API_BASE_URL}/network`)
      ])

      console.log('API responses received:', {
        cpu: cpuResponse.data,
        memory: memoryResponse.data,
        disk: diskResponse.data,
        network: networkResponse.data
      })

      setMetrics({
        cpu: cpuResponse.data,
        memory: memoryResponse.data,
        disk: diskResponse.data,
        network: networkResponse.data
      })
    } catch (err) {
      console.error('Error fetching metrics:', err)
      setError(err.response?.data?.message || err.message || 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchMetrics()
  }, [fetchMetrics])

  useEffect(() => {
    // Initial fetch
    fetchMetrics()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)

    return () => clearInterval(interval)
  }, [fetchMetrics])

  return {
    metrics,
    loading,
    error,
    refreshData
  }
}

export default useMetricData
