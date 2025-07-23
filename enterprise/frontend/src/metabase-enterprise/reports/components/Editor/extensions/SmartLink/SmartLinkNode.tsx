import { Node, mergeAttributes } from "@tiptap/core";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { memo } from "react";

import styles from "./SmartLinkNode.module.css";

export interface SmartLinkAttributes {
  entityId: number;
  model: string;
}

export const SmartLinkNode = Node.create<{
  HTMLAttributes: Record<string, unknown>;
}>({
  name: "smartLink",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      entityId: {
        default: null,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-entity-id") || "0"),
      },
      model: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-model") || "card",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="smart-link"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        HTMLAttributes,
        {
          "data-type": "smart-link",
          "data-entity-id": node.attrs.entityId,
          "data-model": node.attrs.model,
        },
        this.options.HTMLAttributes,
      ),
      `{{link:${node.attrs.model}:${node.attrs.entityId}}}`,
    ];
  },

  renderText({ node }) {
    return `{{link:${node.attrs.model}:${node.attrs.entityId}}}`;
  },
});

export const SmartLinkComponent = memo(
  ({ node }: NodeViewProps) => {
    const { model, entityId } = node.attrs;

    return (
      <NodeViewWrapper as="span" className={styles.smartLink}>
        <a
          href={`/question/${entityId}`}
          target="_blank"
          rel="noreferrer"
          onMouseUp={(e) => {
            // Stop tiptap from opening this link twice
            e.stopPropagation();
          }}
        >
          {model}
          {": "}
          {entityId}
        </a>
      </NodeViewWrapper>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent re-renders
    // Only re-render if these specific props change
    return (
      prevProps.node.attrs.entityId === nextProps.node.attrs.entityId &&
      prevProps.node.attrs.model === nextProps.node.attrs.model &&
      prevProps.selected === nextProps.selected
    );
  },
);

SmartLinkComponent.displayName = "SmartLinkComponent";
