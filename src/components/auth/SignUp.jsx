import React, {useState} from 'react'
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                // Once you've signed up, navigate to questions
                navigate('/questions');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='sign-in-container'>
            <form onSubmit={signUp}>
                <h1>Create Account</h1>
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
                <button type='submit'>Sign Up</button>
            </form>
            <p>Already have an account?</p>
            <a 
                href="/signin" 
                className="text-blue-600 hover:underline"
            >Sign In</a>

        </div>
    )
}

export default SignUp