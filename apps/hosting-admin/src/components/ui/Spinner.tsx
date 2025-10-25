import styled, { css, keyframes } from "styled-components";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";

interface SpinnerProps {
  height?: string;
  fullscreen?: boolean;
  size?: FontAwesomeIconProps["size"];
  message?: string | null;
}

interface ContainerProps {
  $fullscreen: boolean;
  $height?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  height,
  fullscreen = true,
  size = "6x",
  message = null,
}) => (
  <Container $fullscreen={fullscreen} $height={height}>
    <div className="item">
      <IconWrapper>
        <IconStyled spin icon={faCircleNotch} size={size} />
      </IconWrapper>
      {message && (
        <MessageWrapper>
          <h3>{message}</h3>
        </MessageWrapper>
      )}
    </div>
  </Container>
);

const pulse = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
`;

const Container = styled.section<ContainerProps>`
  ${({ $fullscreen, $height }) => css`
    width: 100%;
    height: ${$height || ($fullscreen ? "100%" : "calc(100% - 90px)")};
    display: grid;
    place-items: center;
    background: ${$fullscreen ? theme.colors.dark : "transparent"};

    .item {
      width: auto;
      height: auto;
      padding: ${theme.paddings.x_large};
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${theme.paddings.large};
    }
  `}
`;

const IconWrapper = styled.div`
  ${() => css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const IconStyled = styled(FontAwesomeIcon)`
  ${() => css`
    color: ${theme.colors.primary};
    filter: drop-shadow(0 0 20px ${theme.colors.primary}40);
  `}
`;

const MessageWrapper = styled.div`
  ${() => css`
    text-align: center;
    animation: ${pulse} 2s ease-in-out infinite;

    h3 {
      color: ${theme.colors.font1};
      font-size: ${theme.font_sizes.large};
      font-weight: ${theme.font_weight.medium};
      margin: 0;
    }
  `}
`;
