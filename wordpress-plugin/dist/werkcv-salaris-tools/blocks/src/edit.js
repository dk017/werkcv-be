import { Placeholder, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes, name }) {
  return (
    <Placeholder
      icon="calculator"
      label={__("WerkCV Salaris Tool", "werkcv-salaris-tools")}
      instructions={__("Deze block rendert de WerkCV-tool op de voorkant van de site.", "werkcv-salaris-tools")}
    >
      <p><strong>{name}</strong></p>
      <ToggleControl
        label={__("Toon WerkCV CTA", "werkcv-salaris-tools")}
        checked={!!attributes.cta}
        onChange={(value) => setAttributes({ cta: value })}
      />
      <ToggleControl
        label={__("Toon WerkCV footerlink", "werkcv-salaris-tools")}
        checked={!!attributes.footer}
        onChange={(value) => setAttributes({ footer: value })}
      />
    </Placeholder>
  );
}
