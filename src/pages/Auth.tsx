import { userExists, userNotExists } from '@/redux/reducers/userReducer';
import { RootState } from '@/redux/store';
import supabase from '@/supabase/config';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';


export default function Component() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputUrl = searchParams.get('creatNew');

  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [load, setLoad] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: new File([], '')
  });

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tab === 'signup') {
      setSignupData({
        ...signupData,
        [e.target.name]: e.target.value
      });
    } else {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value
      });
    }
  }

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setSignupData({
            ...signupData,
            photo: file
          })
        }
      }
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoad(true);
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    const id = Math.random().toString(36).slice(2);
    const extention = signupData.photo.name.split('.').pop();
    const fileName = `dp-${id}.${extention}`;

    const { error: storageError } = await supabase.storage.from('profile_pic').upload(fileName, signupData.photo);
    if (storageError) {
      return toast.error(storageError.message || 'Error uploading image');
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          name: signupData.name,
          profile_pic: `${import.meta.env.VITE_SUPABASE_URL}${import.meta.env.VITE_SUPABASE_STORAGE_PROFILE}/${fileName}`
        }
      }
    })
    setLoad(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Please verify your email to login');
      setTab('login');
    }
  }

  const dispatach = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    })
    setLoad(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');
      console.log("user: ", user);
      if (data.user) {
        dispatach(userExists(
          {
            id: data.user.id!,
            name: data.user.user_metadata.name,
            profile_pic: data.user.user_metadata.profile_pic,
            email: data.user.email,
            role: data.user.role
          }
        ));
      } else {
        dispatach(userNotExists());
      }
      navigate('/');
    }
  }

  const { user, loading } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (user) {
      const isAuthenticated = user?.role === 'authenticated';
      if (isAuthenticated && !loading) {
        navigate(`/dashboard?${inputUrl ? `createNew=${inputUrl}` : ''}`);
      }
    }
  }, [])

  return (
    <div className="flex flex-col w-full items-center justify-center bg-gray-100" style={{ minHeight: 'calc(100vh - 6rem)' }}>

      {
        searchParams.get('creatNew') ?
          <h1 className='mt-10 text-4xl'> Hold up! Let's login first.</h1> :
          <h1 className='mt-10 text-5xl font-bold'>LogIn / SignUp</h1>
      }

      <div className="w-full mt-12 max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-lg sm:p-8">
        <div className="w-full">

          {/* TABS */}
          <div className="mb-4 grid w-full grid-cols-2 rounded-md bg-gray-200 p-1">
            <button
              className={`p-2 ${tab === 'signup' ? 'bg-white shadow' : ''}`}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </button>
            <button
              className={`p-2 ${tab === 'login' ? 'bg-white shadow' : ''}`}
              onClick={() => setTab('login')}
            >
              Log In
            </button>
          </div>

          {/* SIGNUP FORM */}
          {tab === 'signup' ? (
            <form className="space-y-4">
              <div className='flex items-center gap-2 p-2'>
                <div className='h-[1px] w-full bg-slate-300'></div>
                {image && <img src={image} alt="profile" className="w-16 h-16 rounded-full" />}
                <div className='h-[1px] w-full bg-slate-300'></div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name='name'
                  value={signupData.name}
                  onChange={handleChanges}
                  placeholder="Enter your name"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name='email'
                  value={signupData.email}
                  onChange={handleChanges}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="relative space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name='password'
                  value={signupData.password}
                  onChange={handleChanges}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-2 right-2 h-7 w-7 text-gray-500"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle password visibility</span>
                </button>
              </div>
              <div className="relative space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name='confirmPassword'
                  value={signupData.confirmPassword}
                  onChange={handleChanges}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute bottom-2 right-2 h-7 w-7 text-gray-500"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle password visibility</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Display Picture: </label>
                <input
                  type="file"
                  id="profile"
                  name="profile"
                  onChange={(e) => changeImage(e)}
                  required />
              </div>

              <button type="submit" onClick={(e) => handleSubmit(e)} className="w-full p-2 bg-blue-500 text-white rounded">
                {load ? <BeatLoader /> : 'Sign Up'}
              </button>
            </form>

          ) : (

            // LOGIN FORM
            <form className="space-y-4" onSubmit={(e) => handleLogin(e)}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name='email'
                  value={loginData.email}
                  onChange={handleChanges}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="relative space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name='password'
                  value={loginData.password}
                  onChange={handleChanges}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-2 right-2 h-7 w-7 text-gray-500"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle password visibility</span>
                </button>
              </div>
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                {load ? <BeatLoader /> : 'Log In'}
              </button>
            </form>

          )}
        </div>
      </div>
    </div>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
