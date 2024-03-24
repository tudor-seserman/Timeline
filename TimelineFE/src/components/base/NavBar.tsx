import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { ApiErrors } from '../errors/ApiErrors';


export const NavBar = () => {
    const navigate = useNavigate();

    const items: MenuItem[] = [
        {
            id: 'nav1',
            label: 'Home',
            command: () => navigate('/'),

        },
        {
            id: 'nav2',
            label: 'Register',
            command: () => navigate('/register'),

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
