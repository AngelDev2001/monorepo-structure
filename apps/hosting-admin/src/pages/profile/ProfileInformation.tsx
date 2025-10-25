import React from "react";
import { Col, Image, Row } from "../../components";
import { PhotoNoFound } from "../../images";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";
import type { User } from "../../providers";

interface ProfileInformationProps {
  user: User;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  user,
}) => {
  return (
    <Container>
      <ProfileCard>
        <AvatarSection>
          <AvatarWrapper>
            <Image
              width={160}
              height={160}
              src={user?.profilePhoto?.thumbUrl || PhotoNoFound}
              className="profile-photo"
              preview
            />
          </AvatarWrapper>
          <UserName>
            {user?.firstName} {user?.paternalSurname}
          </UserName>
        </AvatarSection>

        <InfoSection>
          <SectionTitle>Información Personal</SectionTitle>

          <InfoGrid gutter={[16, 16]}>
            <Col span={24}>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faIdCard} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>DNI</InfoLabel>
                  <InfoValue>
                    {user?.document.number || "No registrado"}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
            </Col>

            <Col span={24}>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{user?.email || "No registrado"}</InfoValue>
                </InfoContent>
              </InfoItem>
            </Col>

            <Col span={24}>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faPhone} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Celular</InfoLabel>
                  <InfoValue>
                    {user?.phone?.number || "No registrado"}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
            </Col>
          </InfoGrid>
        </InfoSection>
      </ProfileCard>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const ProfileCard = styled.div`
  ${() => css`
    background: ${theme.colors.secondary};
    border-radius: ${theme.border_radius.large};
    border: 1px solid ${theme.colors.primary}20;
    overflow: hidden;
    box-shadow: 0 4px 12px ${theme.colors.dark}40;
  `}
`;

const AvatarSection = styled.div`
  ${() => css`
    padding: ${theme.paddings.xxx_large} ${theme.paddings.large};
    text-align: center;
    background: linear-gradient(
      135deg,
      ${theme.colors.secondary} 0%,
      ${theme.colors.dark} 100%
    );
    border-bottom: 2px solid ${theme.colors.primary};
  `}
`;

const AvatarWrapper = styled.div`
  ${() => css`
    width: 160px;
    height: 160px;
    margin: 0 auto ${theme.paddings.large};
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid ${theme.colors.primary};
    box-shadow: 0 8px 24px ${theme.colors.primary}40;
    transition: all 0.3s ease;

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    img {
      border-radius: 50%;
    }
  `}
`;

const UserName = styled.h2`
  ${() => css`
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.x_large};
    font-weight: ${theme.font_weight.large};
    margin-bottom: ${theme.paddings.x_small};
    text-transform: capitalize;
  `}
`;

const InfoSection = styled.div`
  ${() => css`
    padding: ${theme.paddings.x_large} ${theme.paddings.large};
  `}
`;

const SectionTitle = styled.h3`
  ${() => css`
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.large};
    font-weight: ${theme.font_weight.large};
    margin-bottom: ${theme.paddings.large};
    padding-bottom: ${theme.paddings.medium};
    border-bottom: 2px solid ${theme.colors.primary}40;
  `}
`;

const InfoGrid = styled(Row)``;

const InfoItem = styled.div`
  ${() => css`
    display: flex;
    align-items: center;
    gap: ${theme.paddings.medium};
    padding: ${theme.paddings.medium};
    border-radius: ${theme.border_radius.medium};
    background: ${theme.colors.dark}40;
    transition: all 0.2s ease;
  `}
`;

const InfoIcon = styled.div`
  ${() => css`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primary}20;
    border-radius: ${theme.border_radius.medium};
    color: ${theme.colors.primary};
    font-size: ${theme.font_sizes.medium};
    flex-shrink: 0;
  `}
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  ${() => css`
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.x_small};
    margin-bottom: ${theme.paddings.xx_small};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `}
`;

const InfoValue = styled.div`
  ${() => css`
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.small};
    font-weight: ${theme.font_weight.medium};
    word-break: break-word;
  `}
`;
