import { jsx as _jsx } from "react/jsx-runtime";
import { capitalize } from 'lodash';
import Breadcrumb from 'antd/lib/breadcrumb';
export const BreadcrumbLayout = () => {
    const legend = window.location.pathname.split('/').filter((legend) => legend);
    return (_jsx(Breadcrumb, { style: { margin: '16px 0', fontSize: 12 }, children: (legend || []).map((legend, index) => (_jsx(Breadcrumb.Item, { children: legend === 'entities' ? 'Entidad (G.U)' : capitalize(legend) }, index))) }));
};
