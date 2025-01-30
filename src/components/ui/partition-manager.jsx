import { Children } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";

export default function PartitionManager({ children, selectedImages }) {
  const [firstChild, secondChild] = Children.toArray(children);

  const topPanelSize = selectedImages?.length ? 75 : 100;
  const bottomPanelSize = selectedImages?.length ? 25 : 0;

  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="w-full md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={100}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={topPanelSize}>
            <ScrollArea className="p-4">{firstChild}</ScrollArea>
          </ResizablePanel>
          {selectedImages?.length > 0 && <ResizableHandle />}
          {selectedImages?.length > 0 && (
            <ResizablePanel defaultSize={bottomPanelSize}>
              <ScrollArea
                orientation="horizontal"
                className="whitespace-nowrap py-2"
              >
                <h1 className="px-4 font-medium text-muted-foreground text-lg">
                  Selected Images
                </h1>
                {secondChild}
                <Scrollbar orientation="horizontal" />
              </ScrollArea>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
