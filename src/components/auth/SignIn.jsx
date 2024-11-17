import React, {useState} from 'react'
import { auth, db } from '../../firebase';
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
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Log In to Access Your Social City!</h2>
            <form onSubmit={signIn}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input 
                        type='email' 
                        placeholder='Enter your email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input 
                        type='password' 
                        placeholder='Enter your password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required>
                    </input>
                </div>
                <button 
                    type='submit'
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    Log In
                </button>
            </form>
            <p>Need to make an account?</p>
            <a 
                href="/" 
                className="text-blue-600 hover:underline"
            >Sign Up</a>
        </div>
    )
}

export default SignIn
