import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Spin } from '../ui';
import styled from 'styled-components';
import { useState } from 'react';
import { DrawerLayout } from './DrawerLayout.tsx';
import { HeaderLayout } from './HeaderLayout.tsx';
import { BreadcrumbLayout } from './Breadcrumb.tsx';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;
export const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
    const onNavigateTo = (url) => navigate(url);
    return (_jsx(Spin, { tip: "Cargando...", spinning: false, className: "spin-item", children: _jsx(LayoutContainer, { children: _jsxs(Layout, { className: "site-layout", children: [_jsx(DrawerLayout, { isVisibleDrawer: isVisibleDrawer, onSetIsVisibleDrawer: setIsVisibleDrawer, onNavigateTo: onNavigateTo }), _jsx(HeaderLayout, { isVisibleDrawer: isVisibleDrawer, onSetIsVisibleDrawer: setIsVisibleDrawer }), _jsxs(Content, { style: { margin: '0 16px' }, children: [_jsx(BreadcrumbLayout, {}), _jsx("div", { className: "site-layout-background", style: { padding: 24 }, children: children })] })] }) }) }));
};
const LayoutContainer = styled(Layout) `
  min-width: 100vw;
  min-height: 100vh;
  .site-layout-background {
    background: #fff;
  }

  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
  }
`;
