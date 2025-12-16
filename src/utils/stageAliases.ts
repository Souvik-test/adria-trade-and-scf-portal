/**
 * Stage name aliases for flexible permission matching.
 * Different workflows may use different names for equivalent stages.
 */
export const STAGE_ALIASES: Record<string, string[]> = {
  // Approval/Authorization are interchangeable for checker/approver users
  'Authorization': ['Approval', 'Auth', 'Authorize', 'Checker'],
  'Approval': ['Authorization', 'Auth', 'Authorize', 'Final Approval'],
  'Final Approval': ['Approval', 'Authorization'],
  
  // Data Entry variations
  'Data Entry': ['Initiation', 'Create', 'Input'],
  
  // Limit Check variations
  'Limit Check': ['Limit Verification', 'Credit Check'],
  
  // Checker variations  
  'Checker Review': ['Review', 'Verification', 'Checker'],
};

/**
 * Check if a stage name matches any of the accessible stage names,
 * considering aliases for flexible matching.
 */
export const matchesAccessibleStage = (
  stageName: string, 
  accessibleStages: string[]
): boolean => {
  // Direct match or wildcard
  if (accessibleStages.includes(stageName) || accessibleStages.includes('__ALL__')) {
    return true;
  }
  
  // Check if any accessible stage is an alias for the target stage
  for (const accessible of accessibleStages) {
    const aliases = STAGE_ALIASES[accessible] || [];
    if (aliases.includes(stageName)) {
      return true;
    }
  }
  
  // Check reverse: if target stage has aliases that match accessible stages
  const targetAliases = STAGE_ALIASES[stageName] || [];
  if (targetAliases.some(alias => accessibleStages.includes(alias))) {
    return true;
  }
  
  return false;
};
