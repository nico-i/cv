import { generateSkillBasedCollection } from '../../../infrastructure/generators/SkillBasedCollectionGenerator';

export const Concepts = generateSkillBasedCollection({
  name: `concepts`,
  label: `Concepts`,
  withIcon: false,
});
