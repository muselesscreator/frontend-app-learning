import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import EffortEstimate from '../../../../shared/effort-estimate';
import { sequenceIdsSelector } from '../../../data';
import { useModel } from '../../../../generic/model-store';

function UnitNavigationEffortEstimate({ children, sequenceId, unitId }) {
  const sequenceIds = useSelector(sequenceIdsSelector);
  const sequenceIndex = sequenceIds.indexOf(sequenceId);
  const nextSequenceId = sequenceIndex < sequenceIds.length - 1 ? sequenceIds[sequenceIndex + 1] : null;
  const sequence = useModel('sequences', sequenceId);
  const nextSequence = useModel('sequences', nextSequenceId);
  const nextSection = useModel('sections', nextSequence ? nextSequence.sectionId : null);

  if (!sequence || !nextSequence) {
    return children;
  }

  const isLastUnitInSequence = sequence.unitIds.indexOf(unitId) === sequence.unitIds.length - 1;
  if (!isLastUnitInSequence) {
    return children;
  }

  let blockToShow = nextSequence;
  // The experimentation code currently only sets effort on either sequences, sections, or nothing. If we don't have
  // sequence info, we are either doing sections or nothing. Let's look into it.
  if (!nextSequence.effortActivities && !nextSequenceId.effortTime) {
    if (!nextSection.effortActivities && !nextSection.effortTime) {
      return children; // control group - no effort estimates at all
    }

    // Are we at a section border? If so, let's show the next section's effort estimates
    if (sequence.sectionId !== nextSequence.sectionId) {
      blockToShow = nextSection;
    }
  }

  return (
    <div className="d-inline-block">
      {children}
      <EffortEstimate className="d-block mt-1" block={blockToShow} />
    </div>
  );
}

UnitNavigationEffortEstimate.propTypes = {
  children: PropTypes.node,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

UnitNavigationEffortEstimate.defaultProps = {
  children: null,
  unitId: null,
};

export default UnitNavigationEffortEstimate;
