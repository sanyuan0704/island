import styles from './index.module.scss';
import React from 'react';
import { Link } from '../Link/index';
import { DefaultTheme } from '../../../shared/types';
import { useLocaleSiteData, useSidebarData } from '../../logic/index';
import { normalizeHref, normalizeSlash } from '@client';
import { useLocation } from 'react-router-dom';
import { isActive } from '../../logic/index';

export function SideBar() {
  const { pathname } = useLocation();
  const localesData = useLocaleSiteData();
  const { items: sidebarData } = useSidebarData(pathname);
  const langRoutePrefix = normalizeSlash(localesData.routePrefix || '');

  const renderGroupItem = (item: DefaultTheme.SidebarItem, depth = 0) => {
    const marginLeft = `${depth * 20}px`;
    let children: React.ReactElement[] = [];
    if ('items' in item) {
      children = item.items.map((child) => renderGroupItem(child, depth + 1));
    }
    // Extract lang route prefix
    // TODO: base url
    const active = isActive(
      pathname.replace(langRoutePrefix, ''),
      item.link?.replace(langRoutePrefix, '')
    );
    return (
      <div style={{ marginLeft }}>
        <div
          p="1"
          block="~"
          text="sm"
          font-medium="~"
          className={`${active ? 'text-brand' : 'text-text-2'}`}
        >
          <Link href={normalizeHref(item.link!)}>{item.text}</Link>
        </div>
        {children}
      </div>
    );
  };

  const renderGroup = (item: DefaultTheme.SidebarGroup) => {
    return (
      <section key={item.text} block="~" not-first="divider-top mt-4">
        <div flex="~" justify="between" items-start="~">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>
        <div mb="1.4 sm:1">
          {item?.items?.map((item) => (
            <div key={item.link}>{renderGroupItem(item)}</div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        {[sidebarData]
          .filter(Boolean)
          .flat()
          .map((item: DefaultTheme.SidebarGroup | undefined) =>
            renderGroup(item!)
          )}
      </nav>
    </aside>
  );
}
