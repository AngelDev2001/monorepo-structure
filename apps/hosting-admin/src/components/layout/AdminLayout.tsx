import { Layout, Spin } from "../ui";
import styled from "styled-components";
import { type ReactNode, useState } from "react";
import { DrawerLayout } from "./DrawerLayout.tsx";
import { HeaderLayout } from "./HeaderLayout.tsx";
import { BreadcrumbLayout } from "./Breadcrumb.tsx";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);

  const onNavigateTo = (url: string) => navigate(url);

  return (
    <Spin tip="Cargando..." spinning={false} className="spin-item">
      <LayoutContainer>
        <Layout className="site-layout">
          <DrawerLayout
            isVisibleDrawer={isVisibleDrawer}
            onSetIsVisibleDrawer={setIsVisibleDrawer}
            onNavigateTo={onNavigateTo}
          />
          <HeaderLayout
            isVisibleDrawer={isVisibleDrawer}
            onSetIsVisibleDrawer={setIsVisibleDrawer}
          />
          <Content style={{ margin: "0 16px" }}>
            <BreadcrumbLayout />
            <div className="site-layout-background" style={{ padding: 24 }}>
              {children}
            </div>
          </Content>
        </Layout>
      </LayoutContainer>
    </Spin>
  );
};

const LayoutContainer = styled(Layout)`
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
