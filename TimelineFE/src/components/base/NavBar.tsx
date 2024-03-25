import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { ApiErrors } from '../errors/ApiErrors';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useRedux';


export const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let loggedInUser = useAppSelector(state => state.auth.token);

    const items: MenuItem[] = [
        {
            id: 'nav1',
            label: 'Home',
            command: () => navigate('/'),

        },
        {
            id: 'nav4',
            label: 'Login',
            visible: loggedInUser == null,
            command: () => navigate('/login'),
        },
        {
            id: 'nav5',
            label: 'Register',
            visible: loggedInUser == null,
            command: () => navigate('/register'),
        }, {
            id: 'nav6',
            label: 'Logout',
            visible: loggedInUser != null,
            command: () => { dispatch(logout()); navigate('/login') },
        },
    ];

    return (
        <>
            <div className="flex items-center bg-yellow-700">
                <Menubar
                    className=" bg-orange-600 text-black flex"
                    start="Timelines"
                    model={items} />
            </div>
            <ApiErrors />
        </>
    )
}
