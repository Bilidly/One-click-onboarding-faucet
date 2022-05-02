import { useState, useEffect, useCallback } from 'react';

const useAsync = (asyncFn, deps=[], options={}) => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const functionS = useCallback(()=> {
    asyncFn
    .then(result => {
      setValue(result);
      setIsLoading(false);
    })
    .catch(error => {
      setError(error);
      setIsLoading(false);
    })
  }, deps)
  useEffect(() => {
    setIsLoading(true);
    if(!options.paused) {
      functionS();
    }
  }, deps);
  return { value, error, isLoading, loadData: functionS };
}

export default useAsync;