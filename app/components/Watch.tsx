import { useEffect, useState } from 'react';

const Watch = () => {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDateState(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const hours = dateState.getHours();
  const minutes = dateState.getMinutes();
  const seconds = dateState.getSeconds();

  return (
    <div className="text-xl">
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Watch;
