import { useApp } from "@/context/app-provider";
import { TinyImage } from "./tiny-image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from "react";

// SortableItem component - wraps each image
function SortableImage({ image, id }) {
  const { handleSelectImage } = useApp();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  // Track if we're dragging or clicking
  const [mouseDownPos, setMouseDownPos] = useState(null);

  const handleMouseDown = (e) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    if (mouseDownPos) {
      // Calculate distance moved
      const dx = Math.abs(e.clientX - mouseDownPos.x);
      const dy = Math.abs(e.clientY - mouseDownPos.y);

      // If moved less than 5px, consider it a click
      if (dx < 5 && dy < 5) {
        handleSelectImage(image);
      }

      setMouseDownPos(null);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',

  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}>
      <TinyImage image={image} />
    </div>
  );
}

export default function SelectedImages() {
  const { selectedImages, setSelectedImages, onNextStep } = useApp();

  // Setup sensors for mouse/touch and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (selectedImages?.length === 0) return null;

  // Handle the end of a drag event
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedImages((items) => {
        const oldIndex = items.findIndex(item => item.url === active.id);
        const newIndex = items.findIndex(item => item.url === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-start items-center gap-4 p-4 col-span-2 bg-popover rounded-md w-full">
        {selectedImages.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedImages.map(img => img.url)}
              strategy={horizontalListSortingStrategy}
            >
              {selectedImages.map((image) => (
                <SortableImage key={image.url} id={image.url} image={image} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
}