'use client';

import { cn } from '@/lib/utils';
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Plus,
  Trash,
  Settings,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import React, {
  ElementRef,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from 'react';
import { useMediaQuery } from 'usehooks-ts';
import UserItem from './user-items';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Item from './Item';
import toast from 'sonner';
import { Navbar } from './navbar';

import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

import { TrashBox } from './trash-box';

import DocumentList from './document-list';

const Navigation = () => {
  const search = useSearch();
  const settings = useSettings();
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)'); // same as md in tailwind
  const createDocument = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapseSidebar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreateDocument = () => {
    const promise = createDocument({
      title: 'Untitled Document',
    });

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note. Please try again.',
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0'
        )}
      >
        <div
          onClick={collapseSidebar}
          role='button'
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className='w-6 h-6' />
        </div>
        <div>
          <UserItem />
          <Item onClick={search.onOpen} label='Search' isSearch icon={Search} />
          <Item onClick={settings.onOpen} label='Setting' icon={Settings} />
          <Item
            onClick={handleCreateDocument}
            label='New Page'
            icon={PlusCircle}
          />
        </div>
        <div className='mt-4'>
          <DocumentList />
          <Item onClick={handleCreateDocument} icon={Plus} label='Add a page' />
          <Popover>
            <PopoverTrigger className='w-full mt-4'>
              <Item label='Trash' icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className='p-0 w-72'
              side={isMobile ? 'bottom' : 'right'}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px] ',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full'
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className='bg-transparent px-3 py-2 w-full'>
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role='button'
                className='h-6 w-6 text-muted-foreground'
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
