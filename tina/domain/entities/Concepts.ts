import { generateSkillBasedCollection } from '../../infrastructure/generators/SkillBasedCollectionGenerator';

export const Concepts = generateSkillBasedCollection(
  [`concepts`, `Concepts`],
  false,
);
