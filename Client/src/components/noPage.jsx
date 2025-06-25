import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../components/hooks/useCurrentUser';

export default function NoPage() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  const goHome = () => {
    if (currentUser?.user_name) {
      navigate(`/home`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="no-page">
      <h1>404 – הדף לא נמצא</h1>
      <p>הקישור שאליו ניסית להגיע לא קיים.</p>
      <button onClick={goHome}>חזור לדף הבית</button>
    </div>
  );
}
