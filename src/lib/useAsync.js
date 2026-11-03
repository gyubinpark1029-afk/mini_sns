import { useEffect, useState } from 'react';

// 비동기 함수를 실행하고 data / error / isLoading 상태를 돌려주는 작은 훅
export default function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });

  useEffect(() => {
    let isActive = true;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    fn()
      .then((data) => isActive && setState({ data, error: null, isLoading: false }))
      .catch((error) => isActive && setState({ data: null, error, isLoading: false }));
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
