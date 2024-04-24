import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useRedux';
import IReactChildren from '../../interfaces/IReactChildren';
import AddConnection from '../connections/AddConnection';
import { useState } from 'react';
import Alerts from '../alerts/Alerts';


export const NavBar = ({ children }: IReactChildren) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let loggedInUser = useAppSelector(state => state.auth.token);
    const [connectionWindow, setConnectionWindow] = useState(false);

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
            items: [{
                id: 'nav3sub1',
                label: 'All',
                command: () => { navigate('/connections') }
            }
                ,
            {
                id: 'nav3sub2',
                label: 'Add New',
                command: () => { setConnectionWindow(true) }
            },
            ]
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
            <Alerts />
            {connectionWindow && <AddConnection connectionWindow={connectionWindow} setConnectionWindow={setConnectionWindow} />}
            {children}
        </>
    )
}
