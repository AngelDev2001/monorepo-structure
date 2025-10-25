import React from "react";
import { Col, Row, Tabs, Title } from "../../components";
import { ProfileDataForm } from "./ProfileDataForm";
import { ProfileInformation } from "./ProfileInformation";
import { useAuthentication } from "../../providers";
import { useQueryString } from "../../hooks";
import styled, { css } from "styled-components";
import { theme } from "../../styles";

const items = [
  {
    key: "1",
    label: "Editar perfil",
    children: <ProfileDataForm />,
  },
];

export const Profile: React.FC = () => {
  const { authUser } = useAuthentication();
  const [dataEdit] = useQueryString("dataEdit", "1");

  return (
    <Container>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <PageHeader>
            <Title level={2}>Mi Perfil</Title>
            <Subtitle>Administra tu información personal</Subtitle>
          </PageHeader>
        </Col>
        <Col span={24}>
          <ProfileContent gutter={[24, 24]}>
            <Col span={24} lg={8}>
              <ProfileInformation user={authUser} />
            </Col>
            <Col span={24} lg={16}>
              <EditSection>
                <SectionTitle>Información Personal</SectionTitle>
                <Tabs items={items} defaultActiveKey={dataEdit} />
              </EditSection>
            </Col>
          </ProfileContent>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  ${() => css`
    padding: ${theme.paddings.large};
    min-height: 100vh;
  `}
`;

const PageHeader = styled.div`
  ${() => css`
    margin-bottom: ${theme.paddings.large};

    h2 {
      color: ${theme.colors.font1};
      margin-bottom: ${theme.paddings.xx_small};
    }
  `}
`;

const Subtitle = styled.p`
  ${() => css`
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.medium};
    margin: 0;
  `}
`;

const ProfileContent = styled(Row)``;

const EditSection = styled.div`
  ${() => css`
    background: ${theme.colors.secondary};
    border-radius: ${theme.border_radius.large};
    padding: ${theme.paddings.x_large};
    border: 1px solid ${theme.colors.primary}20;

    .ant-tabs {
      .ant-tabs-nav {
        margin-bottom: ${theme.paddings.large};

        .ant-tabs-tab {
          color: ${theme.colors.font2};
          font-weight: ${theme.font_weight.medium};

          &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: ${theme.colors.primary};
            }
          }
        }

        .ant-tabs-ink-bar {
          background: ${theme.colors.primary};
        }
      }
    }
  `}
`;

const SectionTitle = styled.h3`
  ${() => css`
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.large};
    font-weight: ${theme.font_weight.large};
    margin-bottom: ${theme.paddings.large};
  `}
`;
