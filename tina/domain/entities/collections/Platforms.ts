import { generateSkillBasedCollection } from '../../../infrastructure/generators/SkillBasedCollectionGenerator';

export const Platforms = generateSkillBasedCollection({
  name: `platforms`,
  label: `Platforms`,
});
