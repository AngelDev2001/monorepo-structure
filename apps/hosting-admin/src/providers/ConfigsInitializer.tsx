import dayjs from "dayjs";
import { type ReactNode, useEffect, useState } from "react";
import { setLocale } from "yup";
import { yup } from "../config";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import es from "dayjs/locale/es";

import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";

type ConfigsInitializerProps = {
  children: ReactNode;
};

export const ConfigsInitializer = ({ children }: ConfigsInitializerProps) => {
  const [locale] = useState(esES);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);
  dayjs.extend(customParseFormat);
  dayjs.extend(advancedFormat);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isToday);

  useEffect(() => {
    setLocale(yup["es"]);

    dayjs.locale(es);
  }, []);

  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
};
