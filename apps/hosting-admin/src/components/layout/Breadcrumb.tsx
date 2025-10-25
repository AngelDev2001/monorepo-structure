import { capitalize } from "lodash";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { theme } from "../../styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const BreadcrumbLayout = () => {
  const navigate = useNavigate();
  const pathnames = window.location.pathname.split("/").filter((path) => path);

  const breadcrumbItems = [
    {
      title: <FontAwesomeIcon icon={faHome} />,
      onClick: () => navigate("/home"),
      className: "breadcrumb-home",
    },
    ...pathnames.map((path, index) => {
      const url = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        title: path === "entities" ? "Entidad (G.U)" : capitalize(path),
        onClick: index < pathnames.length - 1 ? () => navigate(url) : undefined,
      };
    }),
  ];

  return <BreadcrumbContainer items={breadcrumbItems} />;
};

const BreadcrumbContainer = styled(Breadcrumb)`
  margin: 16px 0;
  padding: 0.8em 0;
  display: flex;
  align-items: center;

  .ant-breadcrumb-link {
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.small};
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.primary};
    }
  }

  li:last-child .ant-breadcrumb-link {
    color: ${theme.colors.font1};
    font-weight: ${theme.font_weight.medium};
    display: flex;
    align-items: center;
  }

  .ant-breadcrumb-separator {
    color: ${theme.colors.gray};
    margin: 0 0.5em;
  }

  li:first-child .ant-breadcrumb-link {
    color: ${theme.colors.font2};
    display: flex;
    align-items: center;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;
