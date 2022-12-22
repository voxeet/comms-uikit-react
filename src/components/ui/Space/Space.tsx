import { useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { SpaceValues } from '../../../theme/types';

type Falsy = null | false;
type BoolCastableSpaceValues = Falsy | SpaceValues;

export type SpaceProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  fw?: boolean | null;
  fh?: boolean | null;
  style?: React.CSSProperties;
  tag?: 'div' | 'span' | 'p';
  children?: React.ReactNode;
  m?: BoolCastableSpaceValues;
  mv?: BoolCastableSpaceValues;
  mh?: BoolCastableSpaceValues;
  mt?: BoolCastableSpaceValues;
  mr?: BoolCastableSpaceValues;
  mb?: BoolCastableSpaceValues;
  ml?: BoolCastableSpaceValues;
  p?: BoolCastableSpaceValues;
  pv?: BoolCastableSpaceValues;
  ph?: BoolCastableSpaceValues;
  pt?: BoolCastableSpaceValues;
  pr?: BoolCastableSpaceValues;
  pb?: BoolCastableSpaceValues;
  pl?: BoolCastableSpaceValues;
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

    if (m) {
      marginTop = spaces[`${m}`];
    } else if (mv) {
      marginTop = spaces[`${mv as SpaceValues}`];
    } else if (mt) {
      marginTop = spaces[`${mt}`];
    }

    if (m) {
      marginBottom = spaces[`${m}`];
    } else if (mv) {
      marginBottom = spaces[`${mv}`];
    } else if (mb) {
      marginBottom = spaces[`${mb}`];
    }

    return { marginTop, marginBottom };
  }, [m, mv, mt, mb]);

  const handleHorizontalMargins = useMemo(() => {
    let marginRight;
    let marginLeft;

    if (m) {
      marginRight = spaces[`${m}`];
    } else if (mh) {
      marginRight = spaces[`${mh}`];
    } else if (mr) {
      marginRight = spaces[`${mr}`];
    }

    if (m) {
      marginLeft = spaces[`${m}`];
    } else if (mh) {
      marginLeft = spaces[`${mh}`];
    } else if (ml) {
      marginLeft = spaces[`${ml}`];
    }

    return { marginRight, marginLeft };
  }, [m, mh, mr, ml]);

  const handleVerticalPaddings = useMemo(() => {
    let paddingTop;
    let paddingBottom;

    if (p) {
      paddingTop = spaces[`${p}`];
    } else if (pv) {
      paddingTop = spaces[`${pv}`];
    } else if (pt) {
      paddingTop = spaces[`${pt}`];
    }

    if (p) {
      paddingBottom = spaces[`${p}`];
    } else if (pv) {
      paddingBottom = spaces[`${pv}`];
    } else if (pb) {
      paddingBottom = spaces[`${pb}`];
    }

    return { paddingTop, paddingBottom };
  }, [p, pv, pt, pb]);

  const handleHorizontalPaddings = useMemo(() => {
    let paddingRight;
    let paddingLeft;

    if (p) {
      paddingRight = spaces[`${p}`];
    } else if (ph) {
      paddingRight = spaces[`${ph}`];
    } else if (pr) {
      paddingRight = spaces[`${pr}`];
    }

    if (p) {
      paddingLeft = spaces[`${p}`];
    } else if (ph) {
      paddingLeft = spaces[`${ph}`];
    } else if (pl) {
      paddingLeft = spaces[`${pl}`];
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
