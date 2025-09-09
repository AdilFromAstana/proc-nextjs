"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface PageItem {
  index: number;
  content: string | number;
  selected?: boolean;
  disabled?: boolean;
  breakView?: boolean;
}

interface PaginateComponentProps {
  value?: number; // current page (controlled)
  pageCount: number; // total pages
  forcePage?: number; // force page (uncontrolled)
  onPageChange?: (page: number) => void; // callback
  pageRange?: number; // range of pages around current
  marginPages?: number; // margin pages at edges
  prevText?: string; // previous button text
  nextText?: string; // next button text
  breakViewText?: string; // break view text
  containerClass?: string; // container class
  pageClass?: string; // page item class
  pageLinkClass?: string; // page link class
  prevClass?: string; // previous button class
  prevLinkClass?: string; // previous link class
  nextClass?: string; // next button class
  nextLinkClass?: string; // next link class
  breakViewClass?: string; // break view class
  breakViewLinkClass?: string; // break view link class
  activeClass?: string; // active class
  disabledClass?: string; // disabled class
  noLiSurround?: boolean; // remove li wrapper
  firstLastButton?: boolean; // show first/last buttons
  firstButtonText?: string; // first button text
  lastButtonText?: string; // last button text
  hidePrevNext?: boolean; // hide prev/next when disabled
  className?: string; // additional class
}

const PaginateComponent: React.FC<PaginateComponentProps> = ({
  value,
  pageCount,
  forcePage,
  onPageChange,
  pageRange = 3,
  marginPages = 1,
  prevText = '<svg width="25" height="25" viewBox="0 0 25 25"> <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /> </svg>',
  nextText = '<svg width="25" height="25" viewBox="0 0 25 25"> <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /> </svg>',
  breakViewText = "…",
  containerClass = "soap-paginate",
  pageClass = "soap-page",
  pageLinkClass = "soap-page-link",
  prevClass = "soap-prev-page",
  prevLinkClass = "soap-prev-link",
  nextClass = "soap-next-page",
  nextLinkClass = "soap-next-link",
  breakViewClass,
  breakViewLinkClass,
  activeClass = "active",
  disabledClass = "disabled",
  noLiSurround = false,
  firstLastButton = false,
  firstButtonText = "First",
  lastButtonText = "Last",
  hidePrevNext = true,
  className = "",
}) => {
  const [innerValue, setInnerValue] = useState(1);
  const [selected, setSelected] = useState(value || innerValue);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle forcePage prop
  useEffect(() => {
    if (forcePage !== undefined && forcePage !== selected) {
      setSelected(forcePage);
    }
  }, [forcePage, selected]);

  // Handle value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const getHref = (page: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageSelected = (selectedPage: number) => {
    if (selected === selectedPage) {
      return;
    }

    setSelected(selectedPage);
    setInnerValue(selectedPage);

    if (onPageChange) {
      onPageChange(selectedPage);
    }

    // Обновляем URL через router.push для App Router
    const newUrl = getHref(selectedPage);
    router.push(newUrl);
  };

  const prevPage = () => {
    if (selected <= 1) {
      return;
    }
    handlePageSelected(selected - 1);
  };

  const nextPage = () => {
    if (selected >= pageCount) {
      return;
    }
    handlePageSelected(selected + 1);
  };

  const firstPageSelected = () => {
    return selected === 1;
  };

  const lastPageSelected = () => {
    return selected === pageCount || pageCount === 0;
  };

  const selectFirstPage = () => {
    if (selected <= 1) {
      return;
    }
    handlePageSelected(1);
  };

  const selectLastPage = () => {
    if (selected >= pageCount) {
      return;
    }
    handlePageSelected(pageCount);
  };

  // Generate pages array
  const generatePages = (): PageItem[] => {
    const items: PageItem[] = [];

    if (pageCount <= pageRange) {
      for (let index = 0; index < pageCount; index++) {
        items.push({
          index: index,
          content: index + 1,
          selected: index === selected - 1,
        });
      }
    } else {
      const halfPageRange = Math.floor(pageRange / 2);

      const setPageItem = (index: number) => {
        items.push({
          index: index,
          content: index + 1,
          selected: index === selected - 1,
        });
      };

      const setBreakView = (index: number) => {
        items.push({
          index: index,
          content: breakViewText,
          disabled: true,
          breakView: true,
        });
      };

      // 1st - loop thru low end of margin pages
      for (let i = 0; i < marginPages; i++) {
        setPageItem(i);
      }

      // 2nd - loop thru selected range
      let selectedRangeLow = 0;
      if (selected - halfPageRange > 0) {
        selectedRangeLow = selected - 1 - halfPageRange;
      }

      let selectedRangeHigh = selectedRangeLow + pageRange - 1;
      if (selectedRangeHigh >= pageCount) {
        selectedRangeHigh = pageCount - 1;
        selectedRangeLow = selectedRangeHigh - pageRange + 1;
      }

      for (
        let i = selectedRangeLow;
        i <= selectedRangeHigh && i <= pageCount - 1;
        i++
      ) {
        setPageItem(i);
      }

      // Check if there is breakView in the left of selected range
      if (selectedRangeLow > marginPages) {
        setBreakView(selectedRangeLow - 1);
      }

      // Check if there is breakView in the right of selected range
      if (selectedRangeHigh + 1 < pageCount - marginPages) {
        setBreakView(selectedRangeHigh + 1);
      }

      // 3rd - loop thru high end of margin pages
      for (let i = pageCount - 1; i >= pageCount - marginPages; i--) {
        setPageItem(i);
      }
    }

    return items;
  };

  const pages = generatePages();

  // Don't render if current page > total pages
  if (selected > pageCount) {
    return null;
  }

  // Render with li wrapper
  if (!noLiSurround) {
    return (
      <div className={cn("paginate-component", className)}>
        <ul className={containerClass}>
          {firstLastButton && (
            <li
              className={cn(
                pageClass,
                firstPageSelected() ? disabledClass : ""
              )}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  selectFirstPage();
                }}
                href={getHref(1)}
                className={pageLinkClass}
                tabIndex={firstPageSelected() ? -1 : 0}
                dangerouslySetInnerHTML={{ __html: firstButtonText }}
              />
            </li>
          )}

          {!firstPageSelected() || !hidePrevNext ? (
            <li
              className={cn(
                prevClass,
                firstPageSelected() ? disabledClass : ""
              )}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  prevPage();
                }}
                href={firstPageSelected() ? "" : getHref(selected - 1)}
                className={prevLinkClass}
                tabIndex={firstPageSelected() ? -1 : 0}
                dangerouslySetInnerHTML={{ __html: prevText }}
              />
            </li>
          ) : null}

          {pages.map((page, index) => (
            <li
              key={page.index}
              className={cn(
                pageClass,
                page.selected ? activeClass : "",
                page.disabled ? disabledClass : "",
                page.breakView ? breakViewClass : ""
              )}
            >
              {page.breakView ? (
                <a
                  className={cn(pageLinkClass, breakViewLinkClass)}
                  tabIndex={0}
                  dangerouslySetInnerHTML={{ __html: breakViewText }}
                />
              ) : page.disabled ? (
                <a className={pageLinkClass} tabIndex={0}>
                  {page.content}
                </a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageSelected(page.index + 1);
                  }}
                  href={getHref(page.index + 1)}
                  className={pageLinkClass}
                  tabIndex={0}
                >
                  {page.content}
                </a>
              )}
            </li>
          ))}

          {!lastPageSelected() || !hidePrevNext ? (
            <li
              className={cn(nextClass, lastPageSelected() ? disabledClass : "")}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  nextPage();
                }}
                href={lastPageSelected() ? "" : getHref(selected + 1)}
                className={nextLinkClass}
                tabIndex={lastPageSelected() ? -1 : 0}
                dangerouslySetInnerHTML={{ __html: nextText }}
              />
            </li>
          ) : null}

          {firstLastButton && (
            <li
              className={cn(pageClass, lastPageSelected() ? disabledClass : "")}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  selectLastPage();
                }}
                href={getHref(pageCount)}
                className={pageLinkClass}
                tabIndex={lastPageSelected() ? -1 : 0}
                dangerouslySetInnerHTML={{ __html: lastButtonText }}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }

  // Render without li wrapper
  return (
    <div className={cn("paginate-component", className)}>
      <div className={containerClass}>
        {firstLastButton && (
          <a
            onClick={(e) => {
              e.preventDefault();
              selectFirstPage();
            }}
            className={cn(
              pageLinkClass,
              firstPageSelected() ? disabledClass : ""
            )}
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: firstButtonText }}
          />
        )}

        {(!firstPageSelected() || !hidePrevNext) && (
          <a
            onClick={(e) => {
              e.preventDefault();
              prevPage();
            }}
            className={cn(
              prevLinkClass,
              firstPageSelected() ? disabledClass : ""
            )}
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: prevText }}
          />
        )}

        {pages.map((page) => (
          <React.Fragment key={page.index}>
            {page.breakView ? (
              <a
                className={cn(
                  pageLinkClass,
                  breakViewLinkClass,
                  page.disabled ? disabledClass : ""
                )}
                tabIndex={0}
                dangerouslySetInnerHTML={{ __html: breakViewText }}
              />
            ) : page.disabled ? (
              <a
                className={cn(
                  pageLinkClass,
                  page.selected ? activeClass : "",
                  disabledClass
                )}
                tabIndex={0}
              >
                {page.content}
              </a>
            ) : (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handlePageSelected(page.index + 1);
                }}
                className={cn(pageLinkClass, page.selected ? activeClass : "")}
                tabIndex={0}
              >
                {page.content}
              </a>
            )}
          </React.Fragment>
        ))}

        {(!lastPageSelected() || !hidePrevNext) && (
          <a
            onClick={(e) => {
              e.preventDefault();
              nextPage();
            }}
            className={cn(
              nextLinkClass,
              lastPageSelected() ? disabledClass : ""
            )}
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: nextText }}
          />
        )}

        {firstLastButton && (
          <a
            onClick={(e) => {
              e.preventDefault();
              selectLastPage();
            }}
            className={cn(
              pageLinkClass,
              lastPageSelected() ? disabledClass : ""
            )}
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: lastButtonText }}
          />
        )}
      </div>
    </div>
  );
};

export default PaginateComponent;
