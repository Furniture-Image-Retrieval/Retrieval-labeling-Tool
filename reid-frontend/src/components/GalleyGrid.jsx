import React from "react";
import LazyLoad from "react-lazy-load";
import GalleryItem from "./GalleryItem.jsx";

const GalleryGrid = (props) => {
  const { data, selectItem, removeItem, matchedGalleryIds } = props;

  const renderMatchedItems = () => {
    const matchedItems = data.filter((item) =>
      matchedGalleryIds?.includes(item.master_id)
    );
    return renderItems(matchedItems);
  };

  const renderUnMatchedItem = () => {
    const unMatchedItems = data.filter(
      (item) => !matchedGalleryIds?.includes(item.master_id)
    );
    return renderItems(unMatchedItems);
  };

  const renderItems = (items) => {
    return items.map((item) => {
      return (
        <LazyLoad key={item.master_id} height={255} offset={300}>
          <GalleryItem
            data={item}
            isSelected={matchedGalleryIds?.includes(item.master_id)}
            onSelect={() => selectItem(item.master_id)}
            onRemove={() => removeItem(item.master_id)}
          />
        </LazyLoad>
      );
    });
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {renderMatchedItems()}
      {renderUnMatchedItem()}
    </div>
  );
};

export default GalleryGrid;
