import { Node, mergeAttributes } from "@tiptap/core";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { memo } from "react";

import Search from "metabase/entities/search";
import { useSelector } from "metabase/lib/redux";
import { Icon } from "metabase/ui";
import { getSearchIconName } from "metabase/visualizations/visualizations/LinkViz/EntityDisplay";
import { getReportCard } from "metabase-enterprise/reports/selectors";

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
    // FIXME: This doesn't copy the link text right
    return `{{link:${node.attrs.model}:${node.attrs.entityId}}}`;
  },
});

export const SmartLinkComponent = memo(
  ({ node }: NodeViewProps) => {
    const { entityId } = node.attrs;
    const card = useSelector((state) => getReportCard(state, entityId));
    if (!card) {
      return null;
    }
    const wrappedEntity = Search.wrapEntity({ ...card, model: "card" });
    const icon = getSearchIconName(wrappedEntity);

    return (
      <NodeViewWrapper as="span">
        <a
          href={`/question/${entityId}`}
          target="_blank"
          rel="noreferrer"
          onMouseUp={(e) => {
            // Stop tiptap from opening this link twice
            e.stopPropagation();
          }}
          className={styles.smartLink}
        >
          <Icon name={icon} className={styles.icon} />
          {card?.name}
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
