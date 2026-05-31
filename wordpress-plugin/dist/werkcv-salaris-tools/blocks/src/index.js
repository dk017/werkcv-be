import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import nettoBruto from "./block-netto-bruto.json";
import vakantiegeld from "./block-vakantiegeld.json";
import minimumloon from "./block-minimumloon.json";

const blocks = [nettoBruto, vakantiegeld, minimumloon];

blocks.forEach((metadata) => {
  registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null,
  });
});
