import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { ApiErrors } from '../errors/ApiErrors';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useRedux';
import { classNames } from 'primereact/utils';


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
            id: 'nav2',
            label: 'Dashboard',
            visible: loggedInUser != null,
            command: () => { navigate('/dash') },
        },
        {
            id: 'nav3',
            label: 'Connections',
            visible: loggedInUser != null,
            command: () => { navigate('/connections') },
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
        },
        {
            id: 'nav6',
            label: 'Logout',
            visible: loggedInUser != null,
            command: () => { dispatch(logout()); navigate('/login') },
        },
    ];




    return (
        <>
            <div className=' bg-Teal '>
                <Menubar
                    className=" bg-Teal text-white border-Teal text-xl font-bold"
                    start="Timelines"
                    model={items} />
            </div>
            <ApiErrors />
        </>
    )
}
