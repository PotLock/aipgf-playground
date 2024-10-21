import { useEffect, useState } from 'react';

interface IGeoLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface IGeoLocationProps {
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export default function useGeolocation(options?: IGeoLocationOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [data, setData] = useState<IGeoLocationProps>({});

  useEffect(() => {
    const successHandler = (e: GeolocationPosition) => {
      setIsLoading(false);
      setError(null);
      setData(e.coords);
    };
    const errorHandler = (e: GeolocationPositionError) => {
      setError(e);
      setIsLoading(false);
    };

    const id = navigator.geolocation.watchPosition(successHandler, errorHandler, options);

    return () => navigator.geolocation.clearWatch(id);
  }, [options]);

  return { isLoading, error, data };
}
