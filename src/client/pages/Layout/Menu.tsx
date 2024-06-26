import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LuMenu } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalEventSubscribe } from '@/utils/event';

export const MobileLayoutMenu: React.FC<{
  list?: React.ReactNode;
}> = React.memo((props) => {
  const [open, setOpen] = useState(false);

  useGlobalEventSubscribe('commonListSelected', () => {
    setOpen(false);
  });

  if (!props.list) {
    return <div />;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="outline" size="icon">
          <LuMenu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-11/12">
        <ScrollArea className="h-full">{props.list}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
});
MobileLayoutMenu.displayName = 'MobileLayoutMenu';
