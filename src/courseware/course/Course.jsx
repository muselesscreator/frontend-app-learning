import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import { AlertList } from '../../generic/user-messages';
import useAccessExpirationAlert from '../../alerts/access-expiration-alert';
import useOfferAlert from '../../alerts/offer-alert';

import Sequence from './sequence';

import { CelebrationModal, shouldCelebrateOnSectionLoad } from './celebration';
import ContentTools from './content-tools';
import CourseBreadcrumbs from './CourseBreadcrumbs';
import CourseSock from '../../generic/course-sock';
import { useModel } from '../../generic/model-store';

import { initCoursewareMMP2P, MMP2PBlockModal } from '../../experiments/mm-p2p';

function Course({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
}) {
  const course = useModel('coursewareMeta', courseId);
  const sequence = useModel('sequences', sequenceId);
  const section = useModel('sections', sequence ? sequence.sectionId : null);

  const pageTitleBreadCrumbs = [
    sequence,
    section,
    course,
  ].filter(element => element != null).map(element => element.title);

  const {
    accessExpiration,
    canShowUpgradeSock,
    celebrations,
    offer,
    org,
    userTimezone,
    verifiedMode,
  } = course;

  // Below the tabs, above the breadcrumbs alerts (appearing in the order listed here)
  const offerAlert = useOfferAlert(offer, userTimezone, 'course');
  const accessExpirationAlert = useAccessExpirationAlert(accessExpiration, userTimezone, 'course');

  const dispatch = useDispatch();
  const celebrateFirstSection = celebrations && celebrations.firstSection;
  const celebrationOpen = shouldCelebrateOnSectionLoad(
    courseId, sequenceId, unitId, celebrateFirstSection, dispatch, celebrations,
  );

  // The below block of code should be reverted after the REV1512 experiment
  const [REV1512FlyoverEnabled, setREV1512FlyoverEnabled] = useState(false);
  window.enableREV1512Flyover = () => {
    setREV1512FlyoverEnabled(true);
  };
  const getCookie = (name) => {
    const match = document.cookie.match(`${name}=([^;]*)`);
    return match ? match[1] : undefined;
  };
  const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
  const isMobile = Boolean(
    userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i),
  );
  const [REV1512FlyoverVisible, setREV1512FlyoverVisible] = useState(isMobile ? false : !(getCookie(`REV1512FlyoverVisible${courseId}`) === 'false'));
  const isREV1512FlyoverVisible = () => REV1512FlyoverEnabled && (REV1512FlyoverVisible || getCookie('REV1512FlyoverVisible') === 'true');
  const toggleREV1512Flyover = () => {
    const setCookie = (cookieName, value, domain) => {
      const cookieDomain = (typeof domain === 'undefined') ? '' : `domain=${domain};`;
      const exdate = new Date();
      exdate.setHours(exdate.getHours() + 4);
      const cookieValue = `${escape(value)}; expires=${exdate.toUTCString()}`;
      document.cookie = `${cookieName}=${cookieValue};${cookieDomain}path=/`;
    };
    const isVisible = isREV1512FlyoverVisible();
    setCookie(`REV1512FlyoverVisible${courseId}`, !isVisible);
    setREV1512FlyoverVisible(!isVisible);
  };
  // The above block of code should be reverted after the REV1512 experiment

  /** [MM-P2P] Experiment */
  const MMP2P = initCoursewareMMP2P(courseId, sequenceId, unitId);

  return (
    <>
      <Helmet>
        <title>{`${pageTitleBreadCrumbs.join(' | ')} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
      { /** This conditional is for the [MM-P2P] Experiment */}
      { !MMP2P.state.isEnabled && (
        <AlertList
          className="my-3"
          topic="course"
          customAlerts={{
            ...accessExpirationAlert,
            ...offerAlert,
          }}
        />
      )}
      <CourseBreadcrumbs
        courseId={courseId}
        sectionId={section ? section.id : null}
        sequenceId={sequenceId}
        toggleREV1512Flyover={toggleREV1512Flyover} /* This line should be reverted after REV1512 experiment */
        REV1512FlyoverEnabled={REV1512FlyoverEnabled} /* This line should be reverted after REV1512 experiment */
        isREV1512FlyoverVisible={isREV1512FlyoverVisible} /* This line should be reverted after REV1512 experiment */
        //* * [MM-P2P] Experiment */
        mmp2p={MMP2P}
      />
      <AlertList topic="sequence" />
      <Sequence
        unitId={unitId}
        sequenceId={sequenceId}
        courseId={courseId}
        unitNavigationHandler={unitNavigationHandler}
        nextSequenceHandler={nextSequenceHandler}
        previousSequenceHandler={previousSequenceHandler}
        toggleREV1512Flyover={toggleREV1512Flyover} /* This line should be reverted after REV1512 experiment */
        isREV1512FlyoverVisible={isREV1512FlyoverVisible} /* This line should be reverted after REV1512 experiment */
        REV1512FlyoverEnabled={REV1512FlyoverEnabled} /* This line should be reverted after REV1512 experiment */
        //* * [MM-P2P] Experiment */
        mmp2p={MMP2P}
      />
      {celebrationOpen && (
        <CelebrationModal
          courseId={courseId}
          open
        />
      )}
      {canShowUpgradeSock && (
        <CourseSock
          courseId={courseId}
          offer={offer}
          orgKey={org}
          pageLocation="Course Content Page"
          verifiedMode={verifiedMode}
        />
      )}
      <ContentTools course={course} />
      { MMP2P.meta.modalLock && <MMP2PBlockModal options={MMP2P} /> }
    </>
  );
}

Course.propTypes = {
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  unitId: PropTypes.string,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,
  unitNavigationHandler: PropTypes.func.isRequired,
};

Course.defaultProps = {
  courseId: null,
  sequenceId: null,
  unitId: null,
};

export default Course;
