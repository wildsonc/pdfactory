import TableCell from "@tiptap/extension-table-cell";

export const TableCellExtended = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["backgroundColor"]) return {};
          return {
            style: `background-color: ${attributes["backgroundColor"]}px`,
          };
        },
      },
      // Border style
      borderWidth: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["borderWidth"]) return {};
          return { style: `border-width: ${attributes["borderWidth"]}px` };
        },
      },
      borderStyle: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["borderStyle"]) return {};
          return { style: `border-style: ${attributes["borderStyle"]}` };
        },
      },
      borderColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["borderColor"]) return {};
          return { style: `border-color: ${attributes["borderColor"]}` };
        },
      },

      borderRight: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["borderRight"]) return {};
          return {
            style: `border-right: ${attributes["borderRight"]}px solid black`,
          };
        },
      },

      borderBottom: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes["borderBottom"]) return {};
          return {
            style: `border-bottom: ${attributes["borderBottom"]}px solid black`,
          };
        },
      },
    };
  },
});
