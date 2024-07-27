import { userNotExists } from '@/redux/reducers/userReducer';
import { RootState } from '@/redux/store';
import supabase from '@/supabase/config';
import { User } from '@/types/types';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AvatarDropdown = () => {

    const navigate = useNavigate();
    const dispatach = useDispatch();
    const {user} = useSelector((state: RootState) => state.user);
    const [userInfo, setUserInfo] = useState<User>({
        id: '',
        name: '',
        profile_pic: '',
        email: '',
        role: ''
    });

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if ((dropdownRef.current as HTMLElement) && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if(user){
            setUserInfo(user);
        }
    },[user])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error logging out", error.message);
        } else {
            toast.success('Logged out successfully');
            dispatach(userNotExists());
            navigate('/');
        }
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <img
                src={`${userInfo.profile_pic}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full cursor-pointer object-fill"
                onClick={toggleDropdown}
            />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link to={``} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{userInfo.name}</Link>
                    <Link to={``} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to={``} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Sign Out</Link>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;
