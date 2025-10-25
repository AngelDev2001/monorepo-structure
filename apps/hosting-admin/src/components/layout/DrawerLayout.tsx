import styled from "styled-components";
import { Drawer, Menu } from "../ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardUser,
  faFileLines,
  faGears,
  faHome,
  faList,
  faSquarePlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";

type DrawerLayoutProps = {
  isVisibleDrawer: boolean;
  onSetIsVisibleDrawer: (isVisibleDrawer: boolean) => void;
  onNavigateTo: (url: string) => void;
};

export const DrawerLayout = ({
  isVisibleDrawer,
  onSetIsVisibleDrawer,
  onNavigateTo,
}: DrawerLayoutProps) => {
  const onClickMenu = (pathname: string) => {
    onSetIsVisibleDrawer(false);
    onNavigateTo(pathname);
  };

  const onClickHome = () => {
    onSetIsVisibleDrawer(false);
    onNavigateTo("/home");
  };

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      onClick: () => onClickHome(),
    },
    // {
    //   label: "Control de Accesos (acls)",
    //   key: "group-acls",
    //   icon: <FontAwesomeIcon icon={faUsersCog} size="lg" />,
    //   children: [
    //     {
    //       label: "Roles con Acls",
    //       key: "default-roles-acls",
    //     },
    //     {
    //       label: "Administrador Acls",
    //       key: "manage-acls",
    //     },
    //   ],
    // },
    {
      label: "Administración",
      key: "manager",
      icon: <FontAwesomeIcon icon={faGears} size="lg" />,
      children: [
        {
          label: "Usuarios",
          key: "users",
          icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
          onClick: () => onClickMenu("/users"),
        },
      ],
    },
    {
      label: "Cotizaciones",
      key: "quotations-group",
      icon: <FontAwesomeIcon icon={faFileLines} size="lg" />,
      children: [
        {
          label: "Crear Cotización",
          key: "quotation-new",
          icon: <FontAwesomeIcon icon={faSquarePlus} size="lg" />,
          onClick: () => onClickMenu("/quotations/new"),
        },
        {
          label: "Lista de cotizaciones",
          key: "quotations-list",
          icon: <FontAwesomeIcon icon={faList} size="lg" />,
          onClick: () => onClickMenu("/quotations"),
        },
      ],
    },
    {
      label: "Asistencias",
      key: "assistances-group",
      icon: <FontAwesomeIcon icon={faClipboardUser} size="lg" />,
      children: [
        {
          label: "Marcar asistencia",
          key: "assistance-new",
          icon: <FontAwesomeIcon icon={faSquarePlus} size="lg" />,
          onClick: () => onClickMenu("/assistances/new"),
        },
        {
          label: "Lista de asistencias",
          key: "assistances-list",
          icon: <FontAwesomeIcon icon={faList} size="lg" />,
          onClick: () => onClickMenu("/assistances"),
        },
      ],
    },
    // {
    //   label: "Sorteos",
    //   key: "raffles-group",
    //   icon: <FontAwesomeIcon icon={faTicket} size="lg" />,
    //   children: [
    //     {
    //       label: "Crear Sorteo",
    //       key: "raffle-new",
    //       icon: <FontAwesomeIcon icon={faSquarePlus} size="lg" />,
    //       onClick: () => onClickMenu("/raffles/new"),
    //     },
    //     {
    //       label: "Lista de Sorteos",
    //       key: "raffles-list",
    //       icon: <FontAwesomeIcon icon={faList} size="lg" />,
    //       onClick: () => onClickMenu("/raffles"),
    //     },
    //   ],
    // },
    // {
    //   label: "Tutoriales",
    //   key: "tutorials-group",
    //   icon: <FontAwesomeIcon icon={faShapes} size="lg" />,
    //   children: [
    //     {
    //       label: "Crear Tutorial",
    //       key: "tutorial-new",
    //       icon: <FontAwesomeIcon icon={faSquarePlus} size="lg" />,
    //       onClick: () => onClickMenu("/tutorials/new"),
    //     },
    //     {
    //       label: "Lista de Tutoriales",
    //       key: "tutorials-list",
    //       icon: <FontAwesomeIcon icon={faList} size="lg" />,
    //       onClick: () => onClickMenu("/tutorials"),
    //     },
    //   ],
    // },
    // {
    //   label: "Encuestas",
    //   key: "surveys-group",
    //   icon: <FontAwesomeIcon icon={faPoll} size="lg" />,
    //   children: [
    //     {
    //       label: "Estudio del Clima Organizacional",
    //       key: "organizational-climate-studies",
    //       icon: <FontAwesomeIcon icon={faFileAlt} size="lg" />,
    //     },
    //   ],
    // },
  ];

  return (
    <DrawerContainer
      key="right"
      title={
        <HeaderTitle>
          <h3>Servitec Work</h3>
          <VersionBadge>v1.0.0</VersionBadge>
        </HeaderTitle>
      }
      placement="left"
      width={330}
      closable={true}
      onClose={() => onSetIsVisibleDrawer(!isVisibleDrawer)}
      open={isVisibleDrawer}
      styles={{
        body: { padding: 0 },
      }}
    >
      <MenuContainer>
        <Menu
          defaultSelectedKeys={["home"]}
          mode="inline"
          items={items}
          inlineIndent={20}
        />
      </MenuContainer>
    </DrawerContainer>
  );
};

const DrawerContainer = styled(Drawer)`
  .ant-drawer-header {
    background: ${theme.colors.black};
    border-bottom: 1px solid rgba(255, 193, 7, 0.2);
    padding: 1.2em 1.5em;
  }

  .ant-drawer-body {
    background: ${theme.colors.secondary};
    padding: 0;
  }

  .ant-drawer-close {
    color: ${theme.colors.font1};

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3 {
    margin: 0;
    color: ${theme.colors.font1};
    font-size: 1.2em;
    font-weight: ${theme.font_weight.large};
  }
`;

const VersionBadge = styled.span`
  background: ${theme.colors.primary};
  color: ${theme.colors.black};
  padding: 0.3em 0.7em;
  border-radius: ${theme.border_radius.x_small};
  font-size: 0.75em;
  font-weight: ${theme.font_weight.medium};
`;

const MenuContainer = styled.div`
  padding: 0.5em 0;

  .ant-menu {
    border-inline-end: none !important;
  }

  .ant-menu-item-icon,
  .ant-menu-submenu-title .anticon {
    font-size: 1.1em;
  }
`;
