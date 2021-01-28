import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  StreakHeader: {
    id: 'learning.streakcelebration.header',
    defaultMessage: '3 Day streak',
  },
  StreakBody: {
    id: 'learning.streakcelebration.body',
    defaultMessage: 'Keep it up, you’re on a roll!',
  },
  StreakButton: {
    id: 'learning.streakcelebration.button',
    defaultMessage: 'Keep it up',
  },
  StreakFactoidABoldedSection: {
    id: 'learning.streakcelebration.factoidaboldedsection',
    defaultMessage: 'are 20x more likely to pass their course',
    description: 'This bolded section is in the following sentence: Users who learn 3 days in a row {bolded_section} than those who don\'t.',
  },
  StreakFactoidBBoldedSection: {
    id: 'learning.streakcelebration.factoidbboldedsection',
    defaultMessage: 'complete 5x as much course content on average',
    description: 'This bolded section is in the following sentence: Users who learn 3 days in a row {bolded_section} vs. those who don\'t.',
  },
});

export default messages;
