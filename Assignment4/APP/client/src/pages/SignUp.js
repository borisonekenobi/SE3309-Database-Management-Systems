import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        email: '',
        date_of_birth: '',
        password: '',
        confirmPassword: '',
        student_number: '',
        address: {
            street_number: '', street_name: '', city: '', province: '', postal_code: '', country: '',
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/client', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    user: {
                        name: formData.name,
                        phone_number: formData.phone_number,
                        email: formData.email,
                        date_of_birth: formData.date_of_birth,
                        password: formData.password,
                    }, student_number: formData.student_number, address: formData.address,
                }),
            });
            const data = await response.json();

            console.log('Sign-up successful:', data);
            alert(`Account created successfully! This is your new card number: ${data.bank_card.number}`);
            navigate('/login');
        } catch (error) {
            console.error('Error signing up:', error.response?.data || error.message);
            alert('Failed to sign up. Please try again.');
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData((prevState) => ({
                ...prevState, address: {
                    ...prevState.address, [addressField]: value,
                },
            }));
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    return (
        <div className="auth-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
            {/* User fields */}
            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Phone Number:</label>
                <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Date of Birth:</label>
                <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Student Number:</label>
                <input
                    type="text"
                    name="student_number"
                    value={formData.student_number}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Address fields */}
            <fieldset className="address-fields">
                <legend>Address</legend>
                <div className="form-group">
                    <label>Street Number:</label>
                    <input
                        type="text"
                        name="address.street_number"
                        value={formData.address.street_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Street Name:</label>
                    <input
                        type="text"
                        name="address.street_name"
                        value={formData.address.street_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Province:</label>
                    <input
                        type="text"
                        name="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        name="address.postal_code"
                        value={formData.address.postal_code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Country:</label>
                    <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        required
                    />
                </div>
            </fieldset>
            <button type="submit" className="btn">Sign Up</button>
        </form>
        <p className="auth-toggle">
            Already have an account? <Link to="/login">Login</Link>
        </p>
    </div>
    );
};

export default SignUp;