import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Lightbulb } from '@edx/paragon/icons';
import { Icon, Modal } from '@edx/paragon';
import { layoutGenerator } from 'react-break';

import { useModel } from '../../generic/model-store';
import StreakMobileImage from './assets/Streak_mobile.png';
import StreakDesktopImage from './assets/Streak_desktop.png';
import messages from './messages';
import recordStreakCelebration from './utils';

function getRandomFactoid(intl) {
  const boldedSectionA = intl.formatMessage(messages.StreakFactoidABoldedSection);
  const boldedSectionB = intl.formatMessage(messages.StreakFactoidBBoldedSection);
  const factoids = [
    (<FormattedMessage
      id="learning.streakcelebration.factoida"
      defaultMessage="Users who learn 3 days in a row {bolded_section} than those who don't."
      values={{
        bolded_section: (<b>{boldedSectionA}</b>),
      }}
    />),
    (<FormattedMessage
      id="learning.streakcelebration.factoidb"
      defaultMessage="Users who learn 3 days in a row {bolded_section} vs. those who don't."
      values={{
        bolded_section: (<b>{boldedSectionB}</b>),
      }}
    />),
  ];
  return factoids[Math.floor(Math.random() * (factoids.length))];
}

function StreakModal({
  courseId, metadataModel, intl, open, ...rest
}) {
  const { org } = useModel(metadataModel, courseId);
  const factoid = getRandomFactoid(intl);
  // eslint-disable-next-line no-unused-vars
  const [randomFactoid, setRandomFactoid] = useState(factoid);

  const layout = layoutGenerator({
    mobile: 0,
    desktop: 575,
  });

  const OnMobile = layout.is('mobile');
  const OnDesktop = layout.isAtLeast('desktop');

  useEffect(() => {
    if (open) {
      recordStreakCelebration(org, courseId);
    }
  }, [open]);

  return (
    <div>
      <Modal
        dialogClassName="StreakModal modal-dialog-centered"
        body={(
          <>
            <p>{intl.formatMessage(messages.StreakBody)}</p>
            <p className="calendar">
              <OnMobile>
                <img src={StreakMobileImage} alt="" className="img-fluid" />
              </OnMobile>
              <OnDesktop>
                <img src={StreakDesktopImage} alt="" className="img-fluid" />
              </OnDesktop>
            </p>
            <div className="factoidRow row mt-3 mx-3 py-3 bg-light-300">
              <Icon className="col-small ml-2 lightbulb" src={Lightbulb} />
              <div className="col-11 factoidWrapper">
                {randomFactoid}
              </div>
            </div>
          </>
        )}
        closeText={intl.formatMessage(messages.StreakButton)}
        onClose={() => {}} // Don't do anything special, just having the modal close is enough (this is a required prop)
        open={open}
        title={intl.formatMessage(messages.StreakHeader)}
        {...rest}
      />
    </div>
  );
}

StreakModal.defaultProps = {
  open: false,
};

StreakModal.propTypes = {
  courseId: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  open: PropTypes.bool,
};

export default injectIntl(StreakModal);
