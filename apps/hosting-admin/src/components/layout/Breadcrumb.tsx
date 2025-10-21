import { capitalize } from "lodash";
import Breadcrumb from "antd/lib/breadcrumb";

export const BreadcrumbLayout = () => {
  const legend = window.location.pathname.split("/").filter((legend) => legend);

  return (
    <Breadcrumb style={{ margin: "16px 0", fontSize: 12 }}>
      {(legend || []).map((legend, index) => (
        <Breadcrumb.Item key={index}>
          {legend === "entities" ? "Entidad (G.U)" : capitalize(legend)}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
