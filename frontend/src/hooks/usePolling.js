import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchServices } from '../store/fleetSlice'

export const usePolling = (interval = 15000) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchServices())
    const id = setInterval(() => {
      dispatch(fetchServices())
    }, interval)
    return () => clearInterval(id)
  }, [dispatch, interval])
}
