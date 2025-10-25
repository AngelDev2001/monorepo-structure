import { Layout, Spin } from "../ui";
import styled from "styled-components";
import { type ReactNode, useState } from "react";
import { DrawerLayout } from "./DrawerLayout.tsx";
import { HeaderLayout } from "./HeaderLayout.tsx";
import { BreadcrumbLayout } from "./Breadcrumb.tsx";
import { useNavigate } from "react-router-dom";
import { theme } from "../../styles";

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
  background: linear-gradient(
    135deg,
    ${theme.colors.dark} 0%,
    #0f1419 100%
  ) !important;

  .site-layout {
    background: ${theme.colors.dark};
  }

  .site-layout-background {
    background: ${theme.colors.secondary};
    padding: 1.5em;
    border-radius: ${theme.border_radius.small};
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 184, 77, 0.15);
  }

  .spin-item {
    .ant-spin-dot-item {
      background-color: ${theme.colors.primary};
    }
    .ant-spin-text {
      color: ${theme.colors.font1};
    }
  }
`;
