import React, {useState} from 'react'
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                // Once signed in, (returning user), move to chat
                navigate('/chat');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='sign-in-container'>
            <form onSubmit={signIn}>
                <h1>Log In to Your Account!</h1>
                <input 
                    type='email' 
                    placeholder='Enter your email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input 
                    type='password' 
                    placeholder='Enter your password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type='submit'>Log In</button>
            </form>
            <p>Need to make an aacount?</p>
            <a 
                href="/" 
                className="text-blue-600 hover:underline"
            >Sign Up</a>
        </div>
    )
}

export default SignIn
