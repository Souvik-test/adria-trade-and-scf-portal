/**
 * All stages that represent checker/verification/approval work.
 * Users with permission to ANY of these stages should have access to ALL of them.
 */
export const CHECKER_STAGES = [
  'Checker Review',
  'Checker',
  'Authorization',
  'Approval',
  'Final Approval',
  'Review',
  'Verification',
  'Auth',
  'Authorize',
];

/**
 * Stage name aliases for flexible permission matching.
 * Different workflows may use different names for equivalent stages.
 */
export const STAGE_ALIASES: Record<string, string[]> = {
  // ALL checker-type stages are interchangeable - users with any checker permission
  // can access all verification/approval stages
  'Authorization': CHECKER_STAGES,
  'Approval': CHECKER_STAGES,
  'Final Approval': CHECKER_STAGES,
  'Checker Review': CHECKER_STAGES,
  'Checker': CHECKER_STAGES,
  'Review': CHECKER_STAGES,
  'Verification': CHECKER_STAGES,
  
  // Data Entry variations
  'Data Entry': ['Initiation', 'Create', 'Input'],
  
  // Limit Check variations
  'Limit Check': ['Limit Verification', 'Credit Check'],
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
  
  // Check if any accessible stage's aliases include the target stage
  for (const accessible of accessibleStages) {
    const aliases = STAGE_ALIASES[accessible] || [];
    if (aliases.includes(stageName)) {
      return true;
    }
  }
  
  // Check reverse: if target stage's aliases include any accessible stage
  const targetAliases = STAGE_ALIASES[stageName] || [];
  if (targetAliases.some(alias => accessibleStages.includes(alias))) {
    return true;
  }
  
  return false;
};
