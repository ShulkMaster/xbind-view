import { TestParams } from './types.ts';

function numberOfTemplateNodes(nodesPerLevel: number, levels: number) {
  if (levels === 0) return nodesPerLevel;
  if (nodesPerLevel === 1) {
    return levels + 1;
  }

  // geometric series
  const numerator = 1 - Math.pow(nodesPerLevel, levels + 1);
  const denominator = 1 - nodesPerLevel;
  return (nodesPerLevel * numerator) / denominator;
}

function numberOfAttributes(attributesPerNode: number, nodes: number) {
  return attributesPerNode * nodes;
}

function decryptParams(cryptName: string): TestParams {
  const [c, p, n, l, aExt] = cryptName.split('-');
  const comps = Number(c.substring(1));
  const props = Number(p.substring(1));
  const nods = Number(n.substring(1));
  const levels = Number(l.substring(1));
  const a = aExt.split('.')[0];
  const attrs = Number(a.substring(1));

  const properties = Math.pow(props, 2);
  const templateNodes = numberOfTemplateNodes(nods, levels);
  const attributes = numberOfAttributes(attrs, templateNodes);

  return {
    attributes: attributes,
    components: comps,
    levels,
    tags: templateNodes,
    properties,
  };
}

function getNLNames(name: string): string {
 const params = decryptParams(name);
  return `n${params.tags}-l${params.levels}`;
}

function calcElements(name: string): number {
  const params = decryptParams(name);
  const comps = params.components;
  const inTags = params.tags * (1 + params.attributes);

  return comps + comps * (inTags + params.properties)
}

export function decryptName(name: string): string {
  const elements = calcElements(name);
  return `${elements} Elements`;
}

function nanosToMillis(nanos: string): number {
  return Number(BigInt(nanos) / BigInt(1_000_000));
}

export const utils = {
  calcElements,
  decryptName,
  decryptParams,
  nanosToMillis,
  getNLNames,
}
