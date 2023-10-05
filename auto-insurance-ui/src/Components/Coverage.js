export default function calculateCoverage(splitLimitLiability, comprehensive, collision, ageLicensed, annualMileage, policyTermMonths) {
    const maxLiabilityCoverage = 500000;
    const maxComprehensiveDeductible = 500;
    const maxCollisionDeductible = 500;
    const ageThreshold = 25;
    const lowMileageThreshold = 10000;
    const basePolicyTermMonths = 12;


    const [liabilityBodilyInjury, liabilityPropertyDamage] = splitLimitLiability.split('/').map(Number);

    let liabilityCoverage = Math.min(liabilityBodilyInjury, maxLiabilityCoverage);
    liabilityCoverage += Math.min(liabilityPropertyDamage, maxLiabilityCoverage);


    let comprehensiveCoverage = maxComprehensiveDeductible - comprehensive;


    let collisionCoverage = maxCollisionDeductible - collision;


    if (ageLicensed < ageThreshold) {

        liabilityCoverage *= 1.2;
        comprehensiveCoverage *= 1.2;
        collisionCoverage *= 1.2;
    }


    if (annualMileage < lowMileageThreshold) {

        liabilityCoverage *= 0.9;
        comprehensiveCoverage *= 0.9;
        collisionCoverage *= 0.9;
    }


    const policyTermFactor = policyTermMonths / basePolicyTermMonths;
    liabilityCoverage *= policyTermFactor;
    comprehensiveCoverage *= policyTermFactor;
    collisionCoverage *= policyTermFactor;


    liabilityCoverage = Math.min(liabilityCoverage, maxLiabilityCoverage);
    comprehensiveCoverage = Math.max(comprehensiveCoverage, 0);
    collisionCoverage = Math.max(collisionCoverage, 0);


    const totalCoverage = liabilityCoverage + comprehensiveCoverage + collisionCoverage;

    return {
        liability: liabilityCoverage,
        comprehensive: comprehensiveCoverage,
        collision: collisionCoverage,
        total: totalCoverage,
    };
}