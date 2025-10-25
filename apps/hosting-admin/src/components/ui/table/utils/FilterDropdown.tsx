import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Button, Checkbox, Col, Divider, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { toUpper } from "lodash";

export interface Filter {
  value: string;
  text: string;
}

export interface FilterDropdownProps {
  filters: Filter[];
  clearFilters: () => void;
  setSelectedKeys: (keys: React.Key[]) => void;
  confirm: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  clearFilters,
  setSelectedKeys,
  confirm,
}) => {
  const [selected, setSelected] = useState<CheckboxValueType[]>([]);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  const onCheckAll = (checked: boolean): void => {
    const values = filters.map((filter) => filter.value);
    setCheckAll(checked);
    setSelected(checked ? values : []);
  };

  const onGroupChange = (checkedValues: CheckboxValueType[]): void => {
    setSelected(checkedValues);
    setCheckAll(checkedValues.length === filters.length);
  };

  const onConfirm = (): void => {
    if (selected.length === 0) {
      clearFilters();
      confirm();
    } else {
      setSelectedKeys(selected as React.Key[]);
      confirm();
    }
  };

  const onReset = (): void => {
    clearFilters();
    setSelected([]);
    setCheckAll(false);
    confirm();
  };

  return (
    <Container>
      <Row className="content">
        <Col span={24}>
          <Checkbox
            onChange={(e) => onCheckAll(e.target.checked)}
            checked={checkAll}
          >
            All
          </Checkbox>
          <Checkbox.Group
            options={filters.map((filter) => ({
              label: toUpper(filter.text),
              value: filter.value,
            }))}
            onChange={onGroupChange}
            value={selected}
          />
        </Col>
      </Row>
      <Divider />
      <Row className="buttons" align="middle" justify="space-between">
        <Col flex="none">
          <Button onClick={onConfirm} type="link">
            Ok
          </Button>
        </Col>
        <Col flex="none">
          <Button onClick={onReset} type="link">
            Reset
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }) => css`
    color: ${theme.colors.font1};
    background: ${theme.colors.secondary};
    border-radius: ${theme.border_radius.xx_small};
    padding: 0.4rem 0.1rem;
    border: 1px solid ${theme.colors.primary}40;

    .content {
      ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 3px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: ${theme.border_radius.xxx_large};
        background-color: ${theme.colors.primary};
        -webkit-box-shadow: 0 0 1px ${theme.colors.primary};
      }

      ::-webkit-scrollbar-corner {
        background-color: transparent;
      }

      max-height: 200px;
      overflow-y: auto;
      padding: 0 0.1rem;

      .ant-checkbox-wrapper {
        margin-left: 0;
        padding: 6px 12px;
        color: ${theme.colors.font1};

        &:hover {
          background: ${theme.colors.primary}20;
          border-radius: ${theme.border_radius.xx_small};
        }

        .ant-checkbox-inner {
          background-color: ${theme.colors.secondary};
          border-color: ${theme.colors.font2};
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
        }
      }

      div.ant-checkbox-group {
        display: grid;
      }
    }

    .ant-divider {
      margin: 0.4rem 0;
      height: 1px;
      background-color: ${theme.colors.font2};
    }

    .buttons {
      .ant-btn-link {
        color: ${theme.colors.primary};

        &:hover {
          color: ${theme.colors.primary};
          opacity: 0.8;
        }
      }
    }
  `}
`;
