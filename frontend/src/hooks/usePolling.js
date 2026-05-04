import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setServices } from '../store/fleetSlice'

export const usePolling = (interval = 5000) => {
  const dispatch = useDispatch()

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get('http://localhost:5500/api/services/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      dispatch(setServices(response.data))
    } catch (error) {
      console.error('Polling error:', error)
    }
  }

  useEffect(() => {
    fetchStatus()
    const id = setInterval(fetchStatus, interval)
    return () => clearInterval(id)
  }, [interval])
}
