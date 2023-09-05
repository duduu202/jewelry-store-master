import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const loginRoute = '/user/session';



const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setPassword('12345678');
    setEmail('master@mestres.com');
  } ,[]);

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    // Chamar a função de login aqui
    console.log("loginRoute",loginRoute)
    const { data } = await api.post(loginRoute, { email, password, remember_me: true });
    console.log(data);
    signIn(data);
    navigate('/');

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;