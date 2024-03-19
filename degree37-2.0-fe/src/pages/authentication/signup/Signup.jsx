import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  faUser,
  faEnvelope,
  faLock,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import FormInput from '../../../components/FormInput';
import { toast } from 'react-toastify';

export const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      return toast.error('Password did not match', { autoClose: 2000 });
    } else if (!password || !email || !firstName || !lastName) {
      return toast.error('Fill the required fields', {
        autoClose: 3000,
        closeButton: true,
      });
    }

    const body = {
      password,
      email,
      first_name: firstName,
      last_name: lastName,
    };
    const result = await fetch(BASE_URL + '/user', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });
    // const data = await result.json();
    if (result.status === 201) {
      toast.success('User registered.', { autoClose: 3000 });
      navigate('/login');
    } else if (result.status === 409) {
      toast.error('Email already exists', { autoClose: 3000 });
    } else {
      toast.error(`Error with statusCode:${result.status}`, {
        autoClose: 3000,
      });
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <FormInput
                        type={'text'}
                        id={'form3Example1c'}
                        val={firstName}
                        setVal={setFirstName}
                        placeholder="Your First Name"
                        iconClass="fa-user"
                        icon={faUser}
                      />
                      <FormInput
                        type={'text'}
                        id={'form3Example5c'}
                        val={lastName}
                        setVal={setLastName}
                        placeholder="Your Last Name"
                        iconClass={'fa-user'}
                        icon={faUser}
                      />
                      <FormInput
                        type={'email'}
                        id={'form3Example3c'}
                        val={email}
                        setVal={setEmail}
                        placeholder="Your Email"
                        iconClass={'fa-envelope'}
                        icon={faEnvelope}
                      />

                      <FormInput
                        type={'password'}
                        id={'form3Example4c'}
                        val={password}
                        setVal={setPassword}
                        placeholder="Password"
                        iconClass={'fa-lock'}
                        icon={faLock}
                      />

                      <FormInput
                        type={'password'}
                        id={'form3Example4cd'}
                        val={confirmPassword}
                        setVal={setConfirmPassword}
                        placeholder="Repeat your password"
                        iconClass={'fa-key'}
                        icon={faKey}
                      />
                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value=""
                          id="form2Example3c"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form2Example3"
                        >
                          I agree all statements in{' '}
                          <a href="#!">Terms of service</a>
                        </label>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Register
                        </button>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <Link href={'/common/login'}>Login</Link>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://i.tribune.com.pk/media/images/1733875-image-1528833688/1733875-image-1528833688.jpg"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
