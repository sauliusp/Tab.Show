import React from 'react';
import { Link, Tooltip } from '@mui/material';

export type ActionLinkButtonProps = {
  href: string;
  label: string;
  title: string;
  overrideTitle?: string;
  extraOpen?: boolean;
  enterDelay?: number;
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function ActionLinkButton(props: ActionLinkButtonProps) {
  const {
    href,
    label,
    title,
    overrideTitle,
    extraOpen = false,
    enterDelay = 0,
    placement = 'top',
    target,
    rel,
    onClick,
    onMouseEnter,
  } = props;

  const [hoverOpen, setHoverOpen] = React.useState(false);

  const effectiveTitle = extraOpen && overrideTitle ? overrideTitle : title;
  const isOpen = extraOpen || hoverOpen;

  return (
    <Tooltip
      title={effectiveTitle}
      placement={placement}
      arrow
      open={isOpen}
      onOpen={() => setHoverOpen(true)}
      onClose={() => setHoverOpen(false)}
      enterDelay={enterDelay}
      slotProps={{ popper: { disablePortal: true } }}
    >
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 1.5,
          boxShadow: 1.5,
          textTransform: 'none',
          fontWeight: '600',
          textDecoration: 'none',
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          fontSize: '0.75rem',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-1.5px)',
            textDecoration: 'none',  
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {label}
      </Link>
    </Tooltip>
  );
}

export default ActionLinkButton;


