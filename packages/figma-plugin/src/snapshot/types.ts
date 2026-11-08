// The shape of the component data the plugin carries. Written by serialize.ts, read by build.ts.

export interface SVariable {
  id: string;
  name: string;
  type: VariableResolvedDataType;
  scopes: VariableScope[];
  codeSyntax: { [platform in CodeSyntaxPlatform]?: string };
  values: Record<string, VariableValue>;
}

export interface SCollection {
  id: string;
  name: string;
  defaultModeId: string;
  modes: { id: string; name: string }[];
  variables: SVariable[];
}

export interface SStyle extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
}

/** A layer. Other fields are the Plugin API's own property names. */
export interface SNode extends Record<string, unknown> {
  type: string;
  children?: SChild[];
}

/** One change to a layer inside an instance, found by child positions from the instance. */
export interface SOverride extends Record<string, unknown> {
  path: number[];
  swap?: string;
  props?: Record<string, string | boolean>;
}

export interface SInstance extends SNode {
  type: 'INSTANCE';
  /** Key of the variant or component this is an instance of. */
  main: string;
  props?: Record<string, string | boolean>;
  overrides?: SOverride[];
  exposed?: boolean;
}

export type SChild = SNode | SInstance;

export interface SVariant extends SNode {
  key: string;
}

export interface SComponent {
  key: string;
  name: string;
  description: string;
  root: SNode;
  /** The variants of a component set; empty for a plain component. */
  variants: SVariant[];
  /** Text, boolean and instance swap properties. Swap values are component keys. */
  props?: { name: string; type: ComponentPropertyType; value: string | boolean; slot?: ComponentPropertyOptions }[];
  /** Keys of the components this one needs to exist first. */
  deps: string[];
}

export interface Snapshot {
  collections: SCollection[];
  styles: { text: SStyle[]; effect: SStyle[]; paint: SStyle[] };
  components: Record<string, SComponent>;
  /** Image hash to base64 bytes. */
  images: Record<string, string>;
}
