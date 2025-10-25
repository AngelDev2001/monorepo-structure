import React, { type MouseEvent } from "react";
import styled, { css, type DefaultTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { tint, transparentize } from "polished";
import Tooltip from "antd/lib/tooltip";
import { theme } from "../../styles";

export interface IconActionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  icon: IconDefinition;
  tooltipTitle?: string;
  size?: number;
  iconStyles?: IconStyles;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

export interface IconStyles {
  color?: (theme: DefaultTheme) => string;
  hoverColor?: (theme: DefaultTheme) => string;
  backgroundColor?: (theme: DefaultTheme) => string;
}

interface IconWrapperProps {
  $size: number;
  $iconStyles: IconStyles;
  $hasOnClick: boolean;
  $disabled: boolean;
}

export const IconAction: React.FC<IconActionProps> = ({
  icon,
  tooltipTitle,
  size = 38,
  iconStyles = {},
  onClick,
  disabled = false,
  ...props
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const content = (
    <IconWrapper
      onClick={handleClick}
      $size={size}
      $iconStyles={iconStyles}
      $hasOnClick={!!onClick}
      $disabled={disabled}
      {...props}
    >
      <FontAwesomeIcon icon={icon} />
    </IconWrapper>
  );

  return tooltipTitle ? (
    <Tooltip placement="top" title={tooltipTitle}>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

const IconWrapper = styled.div<IconWrapperProps>`
  ${({
    $size,
    $hasOnClick,
    $disabled,
    $iconStyles: {
      color = () => theme.colors.font1,
      hoverColor,
      backgroundColor,
    },
  }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.border_radius.percentage_medium};
    height: ${$size}px;
    width: ${$size}px;
    color: ${$disabled ? theme.colors.font2 : color(theme)};
    background: ${backgroundColor ? backgroundColor(theme) : "transparent"};
    transition: all 0.2s ease;
    position: relative;
    opacity: ${$disabled ? 0.5 : 1};
    cursor: ${$disabled ? "not-allowed" : $hasOnClick ? "pointer" : "default"};

    ${$hasOnClick &&
    !$disabled &&
    css`
      &:hover {
        border-radius: ${theme.border_radius.percentage_full};
        background: ${backgroundColor
          ? transparentize(0.8, backgroundColor(theme))
          : tint(0.9, hoverColor ? hoverColor(theme) : color(theme))};
        color: ${hoverColor ? hoverColor(theme) : color(theme)};
        transform: scale(1.1);
        box-shadow: 0 2px 8px
          ${transparentize(0.8, hoverColor ? hoverColor(theme) : color(theme))};
      }

      &:active {
        transform: scale(0.95);
      }
    `}

    .svg-inline--fa {
      height: ${$hasOnClick ? $size * 0.55 : $size}px;
      width: ${$hasOnClick ? $size * 0.55 : $size}px;
      transition: all 0.2s ease;
    }
  `}
`;
