import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies
import './block.factory';

// Generates an Array of block IDs, either from a single block or an array of blocks.
const getIds = (attr) => {
  const blocks = Array.isArray(attr) ? attr : [attr];
  return blocks.map(block => block.id);
};

// Generates an Object in { [block.id]: block } format, either from a single block or an array of blocks.
const getBlocks = (attr) => {
  const blocks = Array.isArray(attr) ? attr : [attr];
  // eslint-disable-next-line no-return-assign,no-sequences
  return blocks.reduce((acc, block) => (acc[block.id] = block, acc), {});
};

Factory.define('courseBlocks')
  .option('courseId', 'course-v1:edX+DemoX+Demo_Course')
  .option('units', ['courseId'], courseId => ([
    Factory.build(
      'block',
      { type: 'vertical' },
      { courseId },
    ),
  ]))
  .option('sequence', ['courseId', 'units'], (courseId, child) => Factory.build(
    'block',
    { type: 'sequential', children: getIds(child) },
    { courseId },
  ))
  .option('section', ['courseId', 'sequence'], (courseId, child) => Factory.build(
    'block',
    { type: 'chapter', children: getIds(child) },
    { courseId },
  ))
  .option('course', ['courseId', 'section'], (courseId, child) => Factory.build(
    'block',
    { type: 'course', children: getIds(child) },
    { courseId },
  ))
  .attr(
    'blocks',
    ['course', 'section', 'sequence', 'units'],
    (course, section, sequence, units) => ({
      [course.id]: course,
      ...getBlocks(section),
      ...getBlocks(sequence),
      ...getBlocks(units),
    }),
  )
  .attr('root', ['course'], course => course.id);

/**
 * Builds a course with a single chapter, sequence, and unit.
 */
export default function buildSimpleCourseBlocks(courseId, title, options = {}) {
  const unitBlocks = options.unitBlocks || [Factory.build(
    'block',
    { type: 'vertical' },
    { courseId },
  )];
  const sequenceBlock = options.sequenceBlock || [Factory.build(
    'block',
    { type: 'sequential', children: unitBlocks.map(block => block.id) },
    { courseId },
  )];
  const sectionBlock = options.sectionBlock || Factory.build(
    'block',
    { type: 'chapter', children: sequenceBlock.map(block => block.id) },
    { courseId },
  );
  const courseBlock = options.courseBlocks || Factory.build(
    'block',
    { type: 'course', display_name: title, children: [sectionBlock.id] },
    { courseId },
  );
  return {
    courseBlocks: options.courseBlocks || Factory.build(
      'courseBlocks',
      {
        courseId,
        hasScheduledContent: options.hasScheduledContent || false,
        title: 'Demo Course',
      },
      {
        units: unitBlocks,
        sequence: sequenceBlock,
        section: sectionBlock,
        course: courseBlock,
      },
    ),
    unitBlocks,
    sequenceBlock,
    sectionBlock,
    courseBlock,
  };
}
