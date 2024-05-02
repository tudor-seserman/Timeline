import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useRedux';
import IReactChildren from '../../interfaces/IReactChildren';
import AddConnection from '../connections/AddConnection';
import { useEffect, useState } from 'react';
import Alerts from '../alerts/Alerts';
import { api, useGetAllPendingUserConnectionsQuery } from '../../API/RTKAPI';
import { Badge } from 'primereact/badge';
import { skipToken } from '@reduxjs/toolkit/query';


export const NavBar = ({ children }: IReactChildren) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let loggedInUser = useAppSelector(state => state.auth.token);
    const [connectionWindow, setConnectionWindow] = useState(false);
    const { data: pendingConnections } = useGetAllPendingUserConnectionsQuery((loggedInUser == null) ? skipToken : void 0);
    const [pendingBadge, setPendingBadge] = useState<number>(0);

    useEffect(() => { pendingConnections != undefined ? setPendingBadge(pendingConnections.length) : null }, [pendingConnections])

    const itemRenderer = (item: MenuItem) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && (pendingBadge > 0) && <Badge className="ml-auto bg-Cora" value={item.badge} />}
        </a>
    );

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
            {
                id: 'nav3sub3',
                label: 'Pending',
                badge: pendingBadge,
                template: itemRenderer,
                visible: pendingConnections != null && pendingConnections.length > 0,
                command: () => { navigate('/connections/pending') }
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
            command: () => {
                dispatch(logout()); dispatch(api.util.resetApiState());
                ; navigate('/login')
            },
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
