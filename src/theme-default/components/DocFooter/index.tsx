import styles from './index.module.scss';
import { usePageData } from 'island/client';
import { useEditLink, useLocaleSiteData, usePrevNextPage } from '../../logic';
import { normalizeHref } from '../../logic/index';
import { useLocation } from 'react-router-dom';

export function DocFooter() {
  const { siteData, relativePagePath, lastUpdatedTime } = usePageData();
  const { prevPage, nextPage } = usePrevNextPage(siteData);
  const { pathname } = useLocation();
  const themeConfig = siteData.themeConfig;
  const {
    editLink: rawEditLink,
    lastUpdatedText,
    prevPageText = 'Previous Page',
    nextPageText = 'Next page'
  } = useLocaleSiteData(themeConfig, pathname);

  const editLink = useEditLink(
    rawEditLink! ?? themeConfig?.editLink,
    relativePagePath
  );

  return (
    <footer mt="8">
      <div p="b-5" flex="~" justify="between" items-center="~">
        {editLink ? (
          <a
            flex="~"
            items-center=""
            leading-8=""
            font-medium="~"
            text="sm brand"
            hover="text-brand-dark"
            href={editLink.link}
            transition="color duration-300"
          >
            {editLink.text}
          </a>
        ) : null}

        <div
          flex=""
          text="sm text-2"
          leading-6="~"
          leading-8="sm:~"
          font-medium=""
        >
          {
            <>
              <p className={styles.lastUpdated}>
                {`${lastUpdatedText ?? 'Last Updated'}: `}
              </p>
              <span>{lastUpdatedTime}</span>
            </>
          }
        </div>
      </div>

      <div
        flex="~ col sm:row"
        justify="sm:around"
        gap="2"
        divider-top=""
        pt="6"
      >
        <div flex="~ col" w="50%">
          {prevPage ? (
            <a href={normalizeHref(prevPage.link)} className={styles.pagerLink}>
              <span className={styles.desc}>{prevPageText}</span>
              <span className={styles.title}>{prevPage.text}</span>
            </a>
          ) : null}
        </div>
        <div flex="~ col" w="50%">
          {nextPage ? (
            <a
              href={normalizeHref(nextPage.link)}
              className={`${styles.pagerLink} ${styles.next}`}
            >
              <span className={styles.desc}>{nextPageText}</span>
              <span className={styles.title}>{nextPage.text}</span>
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
