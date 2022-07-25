/* eslint-disable react/jsx-props-no-spreading */
import type { SpaceValues } from '../../../common/theme/types';
import { useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';

type SpaceProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  fw?: boolean;
  fh?: boolean;
  style?: React.CSSProperties;
  tag?: 'div' | 'span' | 'p';
  children?: React.ReactNode;
  m?: SpaceValues;
  mv?: SpaceValues;
  mh?: SpaceValues;
  mt?: SpaceValues;
  mr?: SpaceValues;
  mb?: SpaceValues;
  ml?: SpaceValues;
  p?: SpaceValues;
  pv?: SpaceValues;
  ph?: SpaceValues;
  pt?: SpaceValues;
  pr?: SpaceValues;
  pb?: SpaceValues;
  pl?: SpaceValues;
};

const Space = ({
  testID,
  fw,
  fh,
  style,
  tag = 'div',
  children,
  m,
  mv,
  mh,
  mt,
  mr,
  mb,
  ml,
  p,
  pv,
  ph,
  pt,
  pr,
  pb,
  pl,
  ...props
}: SpaceProps) => {
  const {
    theme: { spaces },
  } = useTheme();

  const handleVerticalMargins = useMemo(() => {
    let marginTop;
    let marginBottom;

    if (mt) {
      marginTop = spaces[`${mt}`];
    } else if (mv) {
      marginTop = spaces[`${mv}`];
    } else if (m) {
      marginTop = spaces[`${m}`];
    }

    if (mb) {
      marginBottom = spaces[`${mb}`];
    } else if (mv) {
      marginBottom = spaces[`${mv}`];
    } else if (m) {
      marginBottom = spaces[`${m}`];
    }

    return { marginTop, marginBottom };
  }, [m, mv, mt, mb]);

  const handleHorizontalMargins = useMemo(() => {
    let marginRight;
    let marginLeft;

    if (mr) {
      marginRight = spaces[`${mr}`];
    } else if (mh) {
      marginRight = spaces[`${mh}`];
    } else if (m) {
      marginRight = spaces[`${m}`];
    }

    if (ml) {
      marginLeft = spaces[`${ml}`];
    } else if (mh) {
      marginLeft = spaces[`${mh}`];
    } else if (m) {
      marginLeft = spaces[`${m}`];
    }

    return { marginRight, marginLeft };
  }, [m, mh, mr, ml]);

  const handleVerticalPaddings = useMemo(() => {
    let paddingTop;
    let paddingBottom;

    if (pt) {
      paddingTop = spaces[`${pt}`];
    } else if (pv) {
      paddingTop = spaces[`${pv}`];
    } else if (p) {
      paddingTop = spaces[`${p}`];
    }

    if (pb) {
      paddingBottom = spaces[`${pb}`];
    } else if (pv) {
      paddingBottom = spaces[`${pv}`];
    } else if (p) {
      paddingBottom = spaces[`${p}`];
    }

    return { paddingTop, paddingBottom };
  }, [p, pv, pt, pb]);

  const handleHorizontalPaddings = useMemo(() => {
    let paddingRight;
    let paddingLeft;

    if (pr) {
      paddingRight = spaces[`${pr}`];
    } else if (ph) {
      paddingRight = spaces[`${ph}`];
    } else if (p) {
      paddingRight = spaces[`${p}`];
    }

    if (pl) {
      paddingLeft = spaces[`${pl}`];
    } else if (ph) {
      paddingLeft = spaces[`${ph}`];
    } else if (p) {
      paddingLeft = spaces[`${p}`];
    }

    return { paddingRight, paddingLeft };
  }, [p, ph, pr, pl]);

  const Tag = tag;

  return (
    <Tag
      data-testid={testID}
      style={{
        width: fw ? '100%' : undefined,
        height: fh ? '100%' : undefined,
        marginTop: handleVerticalMargins.marginTop,
        marginRight: handleHorizontalMargins.marginRight,
        marginBottom: handleVerticalMargins.marginBottom,
        marginLeft: handleHorizontalMargins.marginLeft,
        paddingTop: handleVerticalPaddings.paddingTop,
        paddingRight: handleHorizontalPaddings.paddingRight,
        paddingBottom: handleVerticalPaddings.paddingBottom,
        paddingLeft: handleHorizontalPaddings.paddingLeft,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Space;
