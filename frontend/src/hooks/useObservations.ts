import { useState, useEffect, useCallback } from 'react';
import { observationsApi } from '../api/observations';
import { Observation, ObservationFilterParams } from '../api/types';

export const useObservations = (initialParams?: ObservationFilterParams) => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ObservationFilterParams>(initialParams || {});

  const fetchObservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await observationsApi.list(params);
      setObservations(data.results);
      setTotalCount(data.count);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch observations';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  return {
    observations,
    totalCount,
    loading,
    error,
    params,
    setParams,
    refetch: fetchObservations,
  };
};