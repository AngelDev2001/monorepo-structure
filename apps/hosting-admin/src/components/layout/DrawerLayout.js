import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { Drawer, Menu } from '../ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardUser, faFileAlt, faFileLines, faGears, faHome, faList, faPoll, faShapes, faSquarePlus, faTicket, faUsers, faUsersCog, } from '@fortawesome/free-solid-svg-icons';
export const DrawerLayout = ({ isVisibleDrawer, onSetIsVisibleDrawer, onNavigateTo, }) => {
    const onClickMenu = (pathname) => {
        onSetIsVisibleDrawer(false);
        onNavigateTo(pathname);
    };
    const onClickHome = () => {
        onSetIsVisibleDrawer(false);
        onNavigateTo('/home');
    };
    const items = [
        {
            label: 'Home',
            key: 'home',
            icon: _jsx(FontAwesomeIcon, { icon: faHome, size: "lg" }),
            isVisible: true,
            onClick: () => onClickHome(),
        },
        {
            label: 'Control de Accesos (acls)',
            key: 'group-acls',
            icon: _jsx(FontAwesomeIcon, { icon: faUsersCog, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Roles con Acls',
                    key: 'default-roles-acls',
                    isVisible: true,
                },
                {
                    label: 'Administrador Acls',
                    key: 'manage-acls',
                    isVisible: true,
                },
            ],
        },
        {
            label: 'Administración',
            key: 'manager',
            icon: _jsx(FontAwesomeIcon, { icon: faGears, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Usuarios',
                    key: 'users',
                    icon: _jsx(FontAwesomeIcon, { icon: faUsers, size: "lg" }),
                    isVisible: true,
                },
            ],
        },
        {
            label: 'Cotizaciones',
            key: 'quotation',
            icon: _jsx(FontAwesomeIcon, { icon: faFileLines, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Crear Cotización',
                    key: 'quotation',
                    icon: _jsx(FontAwesomeIcon, { icon: faSquarePlus, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/quotations/new'),
                },
                {
                    label: 'Lista de cotizaciones',
                    key: 'quotations',
                    icon: _jsx(FontAwesomeIcon, { icon: faList, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/quotations'),
                },
            ],
        },
        {
            label: 'Assistencias',
            key: 'assistance',
            icon: _jsx(FontAwesomeIcon, { icon: faClipboardUser, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Marcar asistencia',
                    key: 'assistance',
                    icon: _jsx(FontAwesomeIcon, { icon: faSquarePlus, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/assistances/new'),
                },
                {
                    label: 'Lista de asistencias',
                    key: 'assistances',
                    icon: _jsx(FontAwesomeIcon, { icon: faList, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/assistances'),
                },
            ],
        },
        {
            label: 'Sorteos',
            key: 'raffles',
            icon: _jsx(FontAwesomeIcon, { icon: faTicket, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Crear Sorteo',
                    key: 'raffle',
                    icon: _jsx(FontAwesomeIcon, { icon: faSquarePlus, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/raffles/new'),
                },
                {
                    label: 'Lista de Sorteos',
                    key: 'raffles-list',
                    icon: _jsx(FontAwesomeIcon, { icon: faList, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/raffles/new'),
                },
            ],
        },
        {
            label: 'Tutoriales',
            key: 'tutorials',
            icon: _jsx(FontAwesomeIcon, { icon: faShapes, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Crear Tutorial',
                    key: 'tutorial',
                    icon: _jsx(FontAwesomeIcon, { icon: faSquarePlus, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/tutorials/new'),
                },
                {
                    label: 'Lista de Tutoriales',
                    key: 'tutorial-list',
                    icon: _jsx(FontAwesomeIcon, { icon: faList, size: "lg" }),
                    isVisible: true,
                    onClick: () => onClickMenu('/tutorials'),
                },
            ],
        },
        {
            label: 'Encuestas',
            key: 'surveys',
            icon: _jsx(FontAwesomeIcon, { icon: faPoll, size: "lg" }),
            isVisible: true,
            children: [
                {
                    label: 'Estudio del Clima Organizacional',
                    key: 'organizational-climate-studies',
                    icon: _jsx(FontAwesomeIcon, { icon: faFileAlt, size: "lg" }),
                    isVisible: true,
                },
            ],
        },
    ];
    return (_jsxs(DrawerContainer, { title: _jsx("div", { style: { width: '100%', textAlign: 'right' }, children: _jsx("h5", { style: { color: '#fff' }, children: "version: \"v1\"" }) }), placement: "left", width: 330, closable: true, onClose: () => onSetIsVisibleDrawer(!isVisibleDrawer), open: isVisibleDrawer, className: "drawer-content", bodyStyle: { padding: '0' }, children: [_jsx("div", { className: "logo" }), _jsx(Menu, { defaultSelectedKeys: ['1'], mode: "inline", items: items })] }, "right"));
};
const DrawerContainer = styled(Drawer) `
  .drawer-content {
    color: #fff;
  }
`;
