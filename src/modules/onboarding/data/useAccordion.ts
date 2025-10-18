import { useCallback, useMemo, useState } from 'react';
import type { AccordionItem } from '../types/accordion.types';

export const useAccordion = (initialItems: AccordionItem[]) => {
  const [items, setItems] = useState<AccordionItem[]>(initialItems);

  const toggleItem = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  }, []);

  const expandAll = useCallback(() => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, isExpanded: true }))
    );
  }, []);

  const collapseAll = useCallback(() => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, isExpanded: false }))
    );
  }, []);

  const expandedItems = useMemo(
    () => items.filter(item => item.isExpanded),
    [items]
  );

  return {
    items,
    toggleItem,
    expandAll,
    collapseAll,
    expandedItems,
  };
};